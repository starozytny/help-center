<?php

namespace App\Controller\User;

use App\Repository\Main\Help\HeDocumentationRepository;
use App\Repository\Main\Help\HeProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/espace-membre/produits', name: 'user_help_')]
class ProductController extends AbstractController
{
    #[Route('/produit/{slug}', name: 'product_read')]
    public function productRead($slug, HeProductRepository $productRepository,
                            HeDocumentationRepository $documentationRepository): Response
    {
        $obj = $productRepository->findOneBy(['slug' => $slug]);
        $documentations = $documentationRepository->findBy(['product' => $obj]);

        return $this->render('user/pages/products/read.html.twig', [
            'elem' => $obj,
            'docs' => $documentations
        ]);
    }

    #[Route('/produit/{p_slug}/documentation/{slug}', name: 'documentation_read')]
    public function documentationRead($p_slug, $slug, HeProductRepository $productRepository,
                         HeDocumentationRepository $documentationRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);
        $obj = $documentationRepository->findOneBy(['product' => $product, 'slug' => $slug]);

        return $this->render('user/pages/documentations/read.html.twig', [
            'elem' => $obj,
        ]);
    }

    #[Route('/produit/{slug}/documentations/create', name: 'documentation_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function documentationCreate($slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        return $this->render('user/pages/documentations/create.html.twig', [
            'product' => $product,
        ]);
    }
}
