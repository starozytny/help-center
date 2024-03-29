<?php

namespace App\Controller\User;

use App\Entity\Enum\Help\HelpFavorite;
use App\Entity\Enum\Help\HelpStatut;
use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeDocumentation;
use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\Help\HeQuestion;
use App\Entity\Main\Help\HeStep;
use App\Entity\Main\Help\HeTutorial;
use App\Entity\Main\User;
use App\Repository\Main\Help\HeDocumentationRepository;
use App\Repository\Main\Help\HeFavoriteRepository;
use App\Repository\Main\Help\HeLikeRepository;
use App\Repository\Main\Help\HeProductRepository;
use App\Repository\Main\Help\HeStepRepository;
use App\Repository\Main\Help\HeTutorialRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/espace-membre/produits', name: 'user_help_')]
class ProductController extends AbstractController
{
    #[Route('/', name: 'products_index', options: ['expose' => true])]
    public function index(HeProductRepository $productRepository): Response
    {
        return $this->render('user/pages/products/index.html.twig', [
            'products' => $productRepository->findAll()
        ]);
    }

    #[Route('/produit/{slug}', name: 'product_read', options: ['expose' => true])]
    public function productRead($slug, HeProductRepository $productRepository,
                                HeDocumentationRepository $documentationRepository,
                                HeTutorialRepository $tutorialRepository,
                                HeFavoriteRepository $favoriteRepository): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        $obj = $productRepository->findOneBy(['slug' => $slug]);

        if($user->getHighRoleCode() == User::CODE_ROLE_USER){
            $documentations = $documentationRepository->findBy(['product' => $obj, 'status' => HelpStatut::Active]);
            $tutorials = $tutorialRepository->findBy(['product' => $obj, 'status' => HelpStatut::Active]);
        }else{
            $documentations = $documentationRepository->findBy(['product' => $obj]);
            $tutorials = $tutorialRepository->findBy(['product' => $obj]);
        }

        $favoritesTuto  = $favoriteRepository->findBy(['user' => $user, 'type' => HelpFavorite::Tutorial]);

        return $this->render('user/pages/products/read.html.twig', [
            'elem' => $obj,
            'docs' => $documentations,
            'tutorials' => $tutorials,
            'favoritesTuto' => $favoritesTuto,
            'canRead' => in_array($obj->getId(), $user->getAccess())
        ]);
    }

    #[Route('/produit/{p_slug}/documentation/{slug}', name: 'documentation_read', options: ['expose' => true])]
    public function documentationRead($p_slug, $slug, HeProductRepository $productRepository,
                                      HeDocumentationRepository $documentationRepository, HeLikeRepository $likeRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        if(!in_array($product->getId(), $this->getUser()->getAccess())){
            throw $this->createAccessDeniedException("Vous n'êtes pas autorisé à accéder à ces informations.");
        }

        $obj     = $documentationRepository->findOneBy(['product' => $product, 'slug' => $slug]);

        if($obj->getStatus() == HelpStatut::Draft && !$this->isGranted('ROLE_ADMIN')){
            throw $this->createAccessDeniedException("Cette page n'existe pas.");
        }

        $answer  = $likeRepository->findOneBy([
            'user' => $this->getUser(), 'type' => HelpFavorite::Documentation, 'identifiant' => $obj->getId()
        ]);

        return $this->render('user/pages/documentations/read.html.twig', [
            'elem' => $obj,
            'answer' => $answer ? $answer->getAnswer() : 2,
            'haveAnswer' => (bool)$answer,
            'type' => HelpFavorite::Documentation
        ]);
    }

    #[Route('/produit/{p_slug}/tutoriel/{slug}', name: 'tutorial_read', options: ['expose' => true])]
    public function tutorialRead($p_slug, $slug, HeProductRepository $productRepository,
                                 HeTutorialRepository $tutorialRepository, HeStepRepository $stepRepository,
                                 HeFavoriteRepository $favoriteRepository, HeLikeRepository $likeRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        if(!in_array($product->getId(), $this->getUser()->getAccess())){
            throw $this->createAccessDeniedException("Vous n'êtes pas autorisé à accéder à ces informations.");
        }

        $obj = $tutorialRepository->findOneBy(['product' => $product, 'slug' => $slug]);

        if($obj->getStatus() == HelpStatut::Draft && !$this->isGranted('ROLE_ADMIN')){
            throw $this->createAccessDeniedException("Cette page n'existe pas.");
        }

        $steps   = $stepRepository->findBy(['tutorial' => $obj]);
        $fav     = $favoriteRepository->findOneBy([
            'user' => $this->getUser(), 'type' => HelpFavorite::Tutorial, 'identifiant' => $obj->getId()
        ]);
        $answer  = $likeRepository->findOneBy([
            'user' => $this->getUser(), 'type' => HelpFavorite::Tutorial, 'identifiant' => $obj->getId()
        ]);

        return $this->render('user/pages/tutorials/read.html.twig', [
            'elem' => $obj,
            'steps' => $steps,
            'isFav' => (bool)$fav,
            'answer' => $answer ? $answer->getAnswer() : 2,
            'haveAnswer' => (bool)$answer,
            'type' => HelpFavorite::Tutorial
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

        $element = $serializer->serialize($obj,'json', ['groups' => HeProduct::FORM]);

        return $this->render('user/pages/products/update.html.twig', [
            'elem' => $obj,
            'element' => $element,
        ]);
    }

    #[Route('/produit/{slug}/tutoriels/ajouter', name: 'tutorial_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function tutorialCreate($slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        return $this->render('user/pages/tutorials/create.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/produit/{p_slug}/tutoriels/modifier/{slug}', name: 'tutorial_update', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function tutorialUpdate($p_slug, $slug, HeTutorialRepository $tutorialRepository,
                                   HeProductRepository $productRepository, HeStepRepository $stepRepository,
                                   SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);
        $obj     = $tutorialRepository->findOneBy(['slug' => $slug]);
        $steps   = $stepRepository->findBy(['tutorial' => $obj]);

        $element = $serializer->serialize($obj,   'json', ['groups' => HeTutorial::FORM]);
        $steps   = $serializer->serialize($steps, 'json', ['groups' => HeStep::FORM]);

        return $this->render('user/pages/tutorials/update.html.twig', [
            'product' => $product,
            'elem' => $obj,
            'element' => $element,
            'steps' => $steps,
        ]);
    }

    #[Route('/produit/{slug}/documentations/ajouter', name: 'documentation_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function documentationCreate($slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        return $this->render('user/pages/documentations/create.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/produit/{p_slug}/documentations/modifier/{slug}', name: 'documentation_update', options: ['expose' => true])]
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

        $obj  = $serializer->serialize($elem, 'json', ['groups' => HeCategory::FORM]);
        return $this->render('user/pages/faq/category/update.html.twig', ['product' => $product, 'elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/produit/{slug}/questions/{category}/ajouter', name: 'question_create', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function questionCreate($slug, HeCategory $category, SerializerInterface $serializer,
                                   HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        $cat  = $serializer->serialize($category, 'json', ['groups' => HeCategory::LIST]);
        return $this->render('user/pages/faq/question/create.html.twig', ['product' => $product, 'category' => $category, 'cat' => $cat]);
    }

    #[Route('/produit/{slug}/questions/{category}/modifier/{id}', name: 'question_update', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function questionUpdate($slug, HeCategory $category, HeQuestion $elem, HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $slug]);

        $obj  = $serializer->serialize($elem, 'json', ['groups' => HeQuestion::FORM]);
        $cat  = $serializer->serialize($category, 'json', ['groups' => HeCategory::LIST]);
        return $this->render('user/pages/faq/question/update.html.twig', ['product' => $product, 'category' => $category, 'cat' => $cat, 'elem' => $elem, 'obj' => $obj]);
    }
}
