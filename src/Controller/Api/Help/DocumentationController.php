<?php

namespace App\Controller\Api\Help;

use App\Entity\Enum\Help\HelpFavorite;
use App\Entity\Main\Help\HeDocumentation;
use App\Repository\Main\Help\HeDocumentationRepository;
use App\Repository\Main\Help\HeLikeRepository;
use App\Repository\Main\Help\HeProductRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataHelp;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/help/documentations', name: 'api_help_documentations_')]
class DocumentationController extends AbstractController
{
    public function submitForm($type, HeDocumentationRepository $repository, HeDocumentation $obj,
                               Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataHelp $dataEntity, HeProductRepository $productRepository): JsonResponse
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $product = $productRepository->findOneBy(['slug' => $data->productSlug]);
        if(!$product){
            return $apiResponse->apiJsonResponseBadRequest('Produit introuvable.');
        }

        $obj = $dataEntity->setDataDocumentation($obj, $data);
        $obj = ($obj)
            ->setProduct($product)
        ;

        if($type == "create") {
            $obj->setAuthor($this->getUser());
        }else{
            $obj->setUpdatedAt(new \DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, HeDocumentation::READ);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeDocumentationRepository $repository, HeProductRepository $productRepository): Response
    {
        return $this->submitForm("create", $repository, new HeDocumentation(), $request, $apiResponse, $validator, $dataEntity, $productRepository);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, HeDocumentation $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeDocumentationRepository $repository, HeProductRepository $productRepository): Response
    {
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity, $productRepository);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(HeDocumentation $obj, HeDocumentationRepository $repository, HeLikeRepository $likeRepository, ApiResponse $apiResponse): Response
    {
        $likes = $likeRepository->findBy(['type' => HelpFavorite::Documentation, 'identifiant' => $obj->getId()]);
        foreach($likes as $like){
            $likeRepository->remove($like);
        }

        $repository->remove($obj, true);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
