<?php

namespace App\Controller\User;

use App\Entity\Enum\Help\HelpStatut;
use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\Help\HeQuestion;
use App\Entity\Main\User;
use App\Repository\Main\Help\HeDocumentationRepository;
use App\Repository\Main\Help\HeProductRepository;
use App\Repository\Main\Help\HeTutorialRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/espace-membre/produits', name: 'user_help_')]
class ProductController extends AbstractController
{
    #[Route('/', name: 'products_index', options: ['expose' => true])]
    public function index(HeProductRepository $productRepository): Response
    {
        if($this->isGranted('ROLE_ADMIN')){
            $products = $productRepository->findAll();
        }else{
            $products = $productRepository->findBy(['isIntern' => false]);
        }

        return $this->render('user/pages/products/index.html.twig', [
            'products' => $products
        ]);
    }

    #[Route('/produit/{slug}', name: 'product_read', options: ['expose' => true])]
    public function productRead($slug, HeProductRepository $productRepository,
                                HeDocumentationRepository $documentationRepository,
                                HeTutorialRepository $tutorialRepository): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        $obj = $productRepository->findOneBy(['slug' => $slug]);

        if ($user->getHighRoleCode() == User::CODE_ROLE_USER) {
            $documentations = $documentationRepository->findBy(['product' => $obj, 'status' => HelpStatut::Active]);
            $tutorials = $tutorialRepository->findBy(['product' => $obj, 'status' => HelpStatut::Active]);
        } else {
            $documentations = $documentationRepository->findBy(['product' => $obj]);
            $tutorials = $tutorialRepository->findBy(['product' => $obj]);
        }

        return $this->render('user/pages/products/read.html.twig', [
            'product' => $obj,
            'elem' => $obj,
            'docs' => $documentations,
            'tutorials' => $tutorials,
            'canRead' => in_array($obj->getId(), $user->getAccess()) || ($this->isGranted('ROLE_ADMIN') && $obj->isIntern() || $this->isGranted("ROLE_ADMIN"))
        ]);
    }

    #[Route('/produits/ajouter', name: 'product_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function productCreate(): Response
    {
        return $this->render('user/pages/products/create.html.twig');
    }

    #[Route('/produits/modifier/{slug}', name: 'product_update')]
    #[IsGranted('ROLE_ADMIN')]
    public function productUpdate($slug, HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $obj = $productRepository->findOneBy(['slug' => $slug]);

        $element = $serializer->serialize($obj, 'json', ['groups' => HeProduct::FORM]);

        return $this->render('user/pages/products/update.html.twig', [
            'elem' => $obj,
            'element' => $element,
        ]);
    }

    #[Route('/produit/{slug}/categories/ajouter', name: 'category_create', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function categoryCreate($slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        return $this->render('user/pages/faq/category/create.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/produit/{slug}/categories/modifier/{id}', name: 'category_update', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function categoryUpdate($slug, HeCategory $elem, HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        $obj = $serializer->serialize($elem, 'json', ['groups' => HeCategory::FORM]);
        return $this->render('user/pages/faq/category/update.html.twig', ['product' => $product, 'elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/produit/{slug}/questions/{category}/ajouter', name: 'question_create', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function questionCreate($slug, HeCategory $category, SerializerInterface $serializer,
                                   HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        $cat = $serializer->serialize($category, 'json', ['groups' => HeCategory::LIST]);
        return $this->render('user/pages/faq/question/create.html.twig', ['product' => $product, 'category' => $category, 'cat' => $cat]);
    }

    #[Route('/produit/{slug}/questions/{category}/modifier/{id}', name: 'question_update', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function questionUpdate($slug, HeCategory $category, HeQuestion $elem, HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        $obj = $serializer->serialize($elem, 'json', ['groups' => HeQuestion::FORM]);
        $cat = $serializer->serialize($category, 'json', ['groups' => HeCategory::LIST]);
        return $this->render('user/pages/faq/question/update.html.twig', ['product' => $product, 'category' => $category, 'cat' => $cat, 'elem' => $elem, 'obj' => $obj]);
    }
}
