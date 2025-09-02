<?php


namespace App\Controller\InternApi\Help;

use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\Help\HeQuestion;
use App\Repository\Main\Help\HeCategoryRepository;
use App\Repository\Main\Help\HeQuestionRepository;
use App\Service\Api\ApiResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/intern/api/help/faq', name: 'intern_api_help_faq_')]
class FaqController extends AbstractController
{
    #[Route('/list/{id}', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(HeProduct $product, HeCategoryRepository $categoryRepository, HeQuestionRepository $questionRepository,
                         ApiResponse $apiResponse, SerializerInterface $serializer): Response
    {
        $categories = $categoryRepository->findBy(['product' => $product]);
        $questions  = $questionRepository->findBy(['category' => $categories]);

        $categories = $serializer->serialize($categories, 'json', ['groups' => HeCategory::LIST]);
        $questions  = $serializer->serialize($questions,  'json', ['groups' => HeQuestion::LIST]);

        return $apiResponse->apiJsonResponseCustom([
            'categories' => $categories,
            'questions' => $questions
        ]);
    }
}
