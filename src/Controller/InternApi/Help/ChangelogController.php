<?php

namespace App\Controller\InternApi\Help;

use App\Entity\Main\Changelog;
use App\Entity\Main\Help\HeChangelog;
use App\Repository\Main\Help\HeChangelogRepository;
use App\Repository\Main\Help\HeProductRepository;
use App\Service\Api\ApiResponse;
use App\Service\Data\DataHelp;
use App\Service\SanitizeData;
use App\Service\ValidatorService;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Uid\Uuid;

#[Route('/intern/api/help/changelogs', name: 'intern_api_help_changelogs_')]
#[IsGranted('ROLE_ADMIN')]
class ChangelogController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(Request $request, HeChangelogRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findBy(['product' => $request->query->get('productId')]), HeChangelog::LIST);
    }

    public function submitForm($type, HeChangelogRepository $repository, HeChangelog $obj, Request $request,
                               ApiResponse $apiResponse, ValidatorService $validator, DataHelp $dataEntity,
                               HeProductRepository $productRepository): JsonResponse
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $product = $productRepository->findOneBy(['slug' => $data->productSlug]);
        if(!$product){
            return $apiResponse->apiJsonResponseBadRequest('Produit introuvable.');
        }

        if($type == "save"){
            $obj = $repository->findOneBy(['uid' => $data->uid]);

            if(!$obj && $data->id){
                $obj = $repository->findOneBy(['id' => $data->id]);
                if(!$obj){
                    $obj = new HeChangelog();
                }
            }else if(!$obj){
                $obj = new HeChangelog();
            }
        }

        $obj = $dataEntity->setDataChangelog($obj, $data, $type);
        $obj = ($obj)
            ->setProduct($product)
        ;

        if($type === "update"){
            $obj->setIsDraft(false);
            $obj->setUpdatedAt(new DateTime());
        }

        if($type === "create" || ($type === "update" && $data->isDraft)){
            $obj->setIsDraft(false);

            if($obj->getNumero() == null){
                $obj->setNumero($product->getNumeroChangelogVersion() + 1);
                $product->setNumeroChangelogVersion($product->getNumeroChangelogVersion() + 1);
            }
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, Changelog::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeChangelogRepository $repository,
                           HeProductRepository $productRepository): Response
    {
        return $this->submitForm(
            "create", $repository, new HeChangelog(), $request, $apiResponse, $validator,
            $dataEntity, $productRepository
        );
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, HeChangelog $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeChangelogRepository $repository,
                           HeProductRepository $productRepository): Response
    {
        return $this->submitForm(
            "update", $repository, $obj, $request, $apiResponse, $validator,
            $dataEntity, $productRepository
        );
    }

    #[Route('/save', name: 'save', options: ['expose' => true], methods: 'POST')]
    public function save(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeChangelogRepository $repository,
                           HeProductRepository $productRepository): Response
    {
        return $this->submitForm(
            "save", $repository, new HeChangelog(), $request, $apiResponse, $validator,
            $dataEntity, $productRepository
        );
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(HeChangelog $obj, HeChangelogRepository $repository, ApiResponse $apiResponse): Response
    {
        $repository->remove($obj, true);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/duplicate/{id}', name: 'duplicate', options: ['expose' => true], methods: 'POST')]
    public function duplicate(Request $request, HeChangelog $obj, ApiResponse $apiResponse,
                              HeChangelogRepository $repository, SanitizeData $sanitizeData): Response
    {
        $data = json_decode($request->getContent());

        $product = $obj->getProduct();

        $newObj = clone $obj;

        $newObj->setIsDraft(true);
        $newObj->setNumero($product->getNumeroChangelogVersion() + 1);
        $newObj->setNumVersion($sanitizeData->trimData($data->numVersion));
        $newObj->setUid(Uuid::v7()->toBase58());
        $newObj->setDateAt(new DateTime());
        $newObj->setName($obj->getName() . " (copie)");
        $newObj->setCreatedAt(new DateTime());
        $newObj->setUpdatedAt(null);

        $product->setNumeroChangelogVersion($product->getNumeroChangelogVersion() + 1);

        $repository->save($newObj, true);

        return $apiResponse->apiJsonResponseCustom(['id' => $newObj->getId()]);
    }
}
