<?php

namespace App\Controller\User;

use App\Entity\Main\Help\HeDocumentation;
use App\Repository\Main\Help\HeDocumentationRepository;
use App\Repository\Main\Help\HeProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

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

    #[Route('/produit/{p_slug}/documentation/{slug}', name: 'documentation_read', options: ['expose' => true])]
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

    #[Route('/produit/{slug}/documentations/update/{id}', name: 'documentation_update')]
    #[IsGranted('ROLE_ADMIN')]
    public function documentationUpdate($slug, HeDocumentation $obj, HeProductRepository $productRepository,
                                        SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);
        $element = $serializer->serialize($obj, 'json', ['groups' => HeDocumentation::FORM]);

        return $this->render('user/pages/documentations/update.html.twig', [
            'product' => $product,
            'elem' => $obj,
            'element' => $element,
        ]);
    }
}
