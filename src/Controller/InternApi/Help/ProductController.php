<?php

namespace App\Controller\InternApi\Help;

use App\Entity\Main\Help\HeDocumentation;
use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\Help\HeQuestion;
use App\Entity\Main\Help\HeTutorial;
use App\Repository\Main\Help\HeProductRepository;
use App\Repository\Main\Help\HeQuestionRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataHelp;
use App\Service\FileUploader;
use App\Service\SanitizeData;
use App\Service\ValidatorService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/intern/api/help/products', name: 'intern_api_help_products_')]
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
            $fileName = $fileUploader->replaceFile($file, HeProduct::FOLDER_LOGO, $obj->getLogo());
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

        foreach($obj->getDocumentations() as $doc){
            $em->remove($doc);
        }

        foreach($obj->getTutorials() as $tuto){
            foreach($tuto->getSteps() as $step){
                $em->remove($step);
            }

            $em->remove($tuto);
        }

        foreach($obj->getCategories() as $cat){
            foreach($cat->getQuestions() as $question){
                $em->remove($question);
            }

            $em->remove($cat);
        }

        $fileUploader->deleteFile($obj->getLogo(), HeProduct::FOLDER_LOGO);

        $em->remove($obj);
        $em->flush($obj);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/data/search/{id}', name: 'data_search', options: ['expose' => true], methods: 'POST')]
    public function dataSearch(HeProduct $obj, HeQuestionRepository $heQuestionRepository,
                               ApiResponse $apiResponse, SerializerInterface $serializer): Response
    {
        $ids = [];
        foreach($obj->getCategories() as $category){
            $ids[] = $category->getId();
        }

        $questions = $heQuestionRepository->findBy(['category' => $ids]);

        return $apiResponse->apiJsonResponseCustom([
            'documentations' => $serializer->serialize($obj->getDocumentations(), 'json', ['groups' => HeDocumentation::SEARCH]),
            'guides' => $serializer->serialize($obj->getTutorials(), 'json', ['groups' => HeTutorial::SEARCH]),
            'questions' => $serializer->serialize($questions, 'json', ['groups' => HeQuestion::SEARCH]),
        ]);
    }

    #[Route('/changelogs/settings/{id}', name: 'changelogs_settings', options: ['expose' => true], methods: 'PUT')]
    public function changelogsSetting(Request $request, HeProduct $obj, HeProductRepository $repository,
                                      SanitizeData $sanitizeData, ApiResponse $apiResponse): Response
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj->setNumeroChangelogVersion((int) $data->numeroChangelogVersion);
        $obj->setFolderChangelog($sanitizeData->trimData($data->folderChangelog));

        $repository->save($obj, true);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
