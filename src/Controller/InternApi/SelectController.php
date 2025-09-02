<?php

namespace App\Controller\InternApi;

use App\Entity\Main\Society;
use App\Entity\Main\User;
use App\Repository\Main\Help\HeProductRepository;
use App\Repository\Main\SocietyRepository;
use App\Service\Api\ApiResponse;
use App\Repository\Main\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/selections', name: 'intern_api_selection_')]
class SelectController extends AbstractController
{
    #[Route('/societies', name: 'societies', options: ['expose' => true], methods: 'GET')]
    public function societies(SocietyRepository $repository, ApiResponse $apiResponse): Response
    {
        $objs = $repository->findAll();
        return $apiResponse->apiJsonResponse($objs, Society::SELECT);
    }

    #[Route('/share/{productSlug}', name: 'share', options: ['expose' => true], methods: 'GET')]
    public function societiesForShare($productSlug, UserRepository $repository, HeProductRepository $productRepository,
                                      ApiResponse $apiResponse): Response
    {
        $product = $productRepository->findOneBy(['slug' => $productSlug]);
        $objs = $repository->findByAccess($product->getId());
        return $apiResponse->apiJsonResponse($objs, User::SHARE);
    }
}
