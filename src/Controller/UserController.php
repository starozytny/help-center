<?php

namespace App\Controller;

use App\Repository\Main\Help\HeDocumentationRepository;
use App\Repository\Main\Help\HeProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/espace-membre', name: 'user_')]
class UserController extends AbstractController
{
    #[Route('/', name: 'homepage')]
    public function index(HeProductRepository $productRepository): Response
    {
        return $this->render('user/pages/index.html.twig', [
            'products' => $productRepository->findAll()
        ]);
    }

    #[Route('/produit/{slug}', name: 'help_product')]
    public function help($slug, HeProductRepository $productRepository,
                         HeDocumentationRepository $documentationRepository): Response
    {
        $obj = $productRepository->findOneBy(['slug' => $slug]);
        $documentations = $documentationRepository->findBy(['product' => $obj]);

        return $this->render('user/pages/products/read.html.twig', [
            'elem' => $obj,
            'docs' => $documentations
        ]);
    }
}
