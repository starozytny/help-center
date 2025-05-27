<?php

namespace App\Controller\InternApi\Help;

use App\Entity\Main\Changelog;
use App\Entity\Main\Help\HeChangelog;
use App\Repository\Main\Help\HeChangelogRepository;
use App\Repository\Main\Help\HeProductRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataHelp;
use App\Service\Transfert\TransfertService;
use App\Service\ValidatorService;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

#[Route('/intern/api/help/changelogs', name: 'intern_api_help_changelogs_')]
#[IsGranted('ROLE_ADMIN')]
class ChangelogController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(HeChangelogRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findAll(), HeChangelog::LIST);
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

        $obj = $dataEntity->setDataChangelog($obj, $data);
        $obj = ($obj)
            ->setProduct($product)
            ->setNumero($product->getNumeroChangelog() + 1)
        ;

        if($type === "update"){
            $obj->setUpdatedAt(new DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $product->setNumeroChangelog($product->getNumeroChangelog() + 1);

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

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(HeChangelog $obj, HeChangelogRepository $repository, ApiResponse $apiResponse): Response
    {
        $repository->remove($obj, true);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    #[Route('/generate/file/{id}', name: 'generate_file', options: ['expose' => true], methods: 'POST')]
    public function generateFile(HeChangelog $obj, ApiResponse $apiResponse, Environment $twig,
                                 TransfertService $transfertService, HeChangelogRepository $repository): Response
    {
        $html = $twig->render('user/generate/changelogs/gerance.html.twig', [
            'elem' => $obj
        ]);

        $filename = $obj->getFilename() ?: $obj->getNumero() . "_NV_" .$obj->getCreatedAt()->format('Ymd'). '.html';
        $path = $this->getParameter('private_directory') . '/export/generated/' . $filename;

        $obj->setFilename($filename);

        file_put_contents($path, $html);

        $resultFtp = $transfertService->sendToFTP($filename, $path);
        if($resultFtp !== true){
            return $apiResponse->apiJsonResponseBadRequest($resultFtp);
        }

        $repository->save($obj, true);;

        return $apiResponse->apiJsonResponse($obj, HeChangelog::LIST);
    }
}
