<?php

namespace App\Controller\Api\Help;

use App\Entity\Enum\Help\HelpFavorite;
use App\Entity\Main\Help\HeFavorite;
use App\Entity\Main\Help\HeLike;
use App\Entity\Main\Help\HeProduct;
use App\Repository\Main\Help\HeProductRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataHelp;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/help/products', name: 'api_help_products_')]
class ProductController extends AbstractController
{
    public function submitForm($type, HeProductRepository $repository, HeProduct $obj,
                               Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataHelp $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        $data = json_decode($request->get('data'));
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataProduct($obj, $data);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $file = $request->files->get('logo');
        if ($file) {
            $fileName = $fileUploader->replaceFile($file, HeProduct::FOLDER, $obj->getLogo());
            $obj->setLogo($fileName);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, HeProduct::READ);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeProductRepository $repository, FileUploader $fileUploader): Response
    {
        return $this->submitForm("create", $repository, new HeProduct(), $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'POST')]
    public function update(Request $request, HeProduct $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeProductRepository $repository, FileUploader $fileUploader): Response
    {
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(HeProduct $obj, ManagerRegistry $registry, ApiResponse $apiResponse, FileUploader $fileUploader): Response
    {
        $em = $registry->getManager();

        $docsIds = [];
        foreach($obj->getDocumentations() as $doc){
            $docsIds[] = $doc->getId();
            $em->remove($doc);
        }

        $tutosIds = [];
        foreach($obj->getTutorials() as $tuto){
            foreach($tuto->getSteps() as $step){
                $em->remove($step);
            }

            $tutosIds[] = $tuto->getId();
            $em->remove($tuto);
        }

        foreach($obj->getCategories() as $cat){
            foreach($cat->getQuestions() as $question){
                $em->remove($question);
            }

            $em->remove($cat);
        }

        $favorites = $em->getRepository(HeFavorite::class)->findBy([
            'type' => HelpFavorite::Tutorial, 'identifiant' => $tutosIds
        ]);
        $tutoAnswers = $em->getRepository(HeLike::class)->findBy([
            'type' => HelpFavorite::Tutorial, 'identifiant' => $tutosIds
        ]);
        $docAnswers = $em->getRepository(HeLike::class)->findBy([
            'type' => HelpFavorite::Documentation, 'identifiant' => $docsIds
        ]);

        foreach($favorites as $item) $em->remove($item);
        foreach($tutoAnswers as $item) $em->remove($item);
        foreach($docAnswers as $item) $em->remove($item);

        $fileUploader->deleteFile($obj->getLogo(), HeProduct::FOLDER);

        $em->remove($obj);
        $em->flush($obj);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
