<?php

namespace App\Controller\User;

use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeDocumentation;
use App\Entity\Main\Help\HeQuestion;
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
    #[Route('/produit/{slug}', name: 'product_read', options: ['expose' => true])]
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

    #[Route('/produit/{slug}/documentation/ajouter', name: 'documentation_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function documentationCreate($slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        return $this->render('user/pages/documentations/create.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/produit/{p_slug}/documentation/modifier/{slug}', name: 'documentation_update')]
    #[IsGranted('ROLE_ADMIN')]
    public function documentationUpdate($p_slug, $slug, HeDocumentationRepository $documentationRepository,
                                        HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);
        $obj     = $documentationRepository->findOneBy(['slug' => $slug]);

        $element = $serializer->serialize($obj, 'json', ['groups' => HeDocumentation::FORM]);

        return $this->render('user/pages/documentations/update.html.twig', [
            'product' => $product,
            'elem' => $obj,
            'element' => $element,
        ]);
    }

    #[Route('/produit/{slug}/categorie/ajouter', name: 'category_create', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function categoryCreate($slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        return $this->render('user/pages/faq/category/create.html.twig');
    }

    #[Route('/produit/{slug}/categorie/modifier/{id}', name: 'category_update', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function categoryUpdate(HeCategory $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => HeCategory::FORM]);
        return $this->render('user/pages/faq/category/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/produit/{slug}/question/{category}/ajouter', name: 'question_create', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function questionCreate($slug, HeCategory $category, SerializerInterface $serializer,
                                   HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        $cat  = $serializer->serialize($category, 'json', ['groups' => HeCategory::LIST]);
        return $this->render('user/pages/faq/question/create.html.twig', ['category' => $category, 'cat' => $cat]);
    }

    #[Route('/produit/{slug}/question/{category}/modifier/{id}', name: 'question_update', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function questionUpdate(HeCategory $category, HeQuestion $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => HeQuestion::FORM]);
        $cat  = $serializer->serialize($category, 'json', ['groups' => HeCategory::LIST]);
        return $this->render('user/pages/faq/question/update.html.twig', ['category' => $category, 'cat' => $cat, 'elem' => $elem, 'obj' => $obj]);
    }
}
