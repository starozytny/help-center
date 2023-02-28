<?php

namespace App\Controller\Api\Help;

use App\Entity\Main\Help\HeStep;
use App\Entity\Main\Help\HeTutorial;
use App\Repository\Main\Help\HeProductRepository;
use App\Repository\Main\Help\HeStepRepository;
use App\Repository\Main\Help\HeTutorialRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataHelp;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/help/tutorials', name: 'api_help_tutorials_')]
class TutorialController extends AbstractController
{
    public function submitForm($type, HeTutorialRepository $repository, HeTutorial $obj,
                               Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataHelp $dataEntity,
                               HeProductRepository $productRepository, HeStepRepository $stepRepository): JsonResponse
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $product = $productRepository->findOneBy(['slug' => $data->productSlug]);
        if(!$product){
            return $apiResponse->apiJsonResponseBadRequest('Produit introuvable.');
        }

        $obj = $dataEntity->setDataTutorial($obj, $data);
        $obj = ($obj)
            ->setProduct($product)
        ;

        if($type == "create") {
            $obj->setAuthor($this->getUser());
        }else{
            $obj->setUpdatedAt(new \DateTime());

            $steps = $stepRepository->findBy(['tutorial' => $obj]);
            foreach($steps as $s){
                $stepRepository->remove($s);
            }
        }

        $dataArray = (array) $data; $order = 1;
        for ($i = 1 ; $i <= $data->nbSteps ; $i++){
            $name = 'step' . $i;

            if($dataArray[$name] != "" && $dataArray[$name] != "<p><br></p>"){
                $step = (new HeStep())
                    ->setPosition($order)
                    ->setContent($dataArray[$name]->value)
                    ->setTutorial($obj)
                ;

                $stepRepository->save($step);
                $order++;
            }
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, HeTutorial::READ);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeTutorialRepository $repository, HeProductRepository $productRepository,
                           HeStepRepository $stepRepository): Response
    {
        return $this->submitForm("create", $repository, new HeTutorial(), $request, $apiResponse, $validator, $dataEntity, $productRepository, $stepRepository);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, HeTutorial $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeTutorialRepository $repository, HeProductRepository $productRepository,
                           HeStepRepository $stepRepository): Response
    {
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity, $productRepository, $stepRepository);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(HeTutorial $obj, HeTutorialRepository $repository, ApiResponse $apiResponse): Response
    {
        $repository->remove($obj, true);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
