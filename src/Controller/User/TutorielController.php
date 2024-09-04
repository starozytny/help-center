<?php

namespace App\Controller\User;

use App\Entity\Enum\Help\HelpStatut;
use App\Entity\Main\Help\HeStep;
use App\Entity\Main\Help\HeTutorial;
use App\Repository\Main\Help\HeProductRepository;
use App\Repository\Main\Help\HeStepRepository;
use App\Repository\Main\Help\HeTutorialRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/espace-membre/produits/produit/{p_slug}/tutoriels', name: 'user_help_tutorial_')]
class TutorielController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index($p_slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        if (!in_array($product->getId(), $this->getUser()->getAccess())) {
            throw $this->createAccessDeniedException("Vous n'êtes pas autorisé à accéder à ces informations.");
        }

        $objs = $product->getTutorials();

        return $this->render('user/pages/tutorials/index.html.twig', [
            'product' => $product,
            'tutorials' => $objs
        ]);
    }

    #[Route('/ajouter', name: 'create')]
    #[IsGranted('ROLE_ADMIN')]
    public function create($p_slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        return $this->render('user/pages/tutorials/create.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/modifier/{slug}', name: 'update', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function update($p_slug, $slug, HeTutorialRepository $tutorialRepository,
                                   HeProductRepository $productRepository, HeStepRepository $stepRepository,
                                   SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);
        $obj = $tutorialRepository->findOneBy(['slug' => $slug]);
        $steps = $stepRepository->findBy(['tutorial' => $obj]);

        $element = $serializer->serialize($obj, 'json', ['groups' => HeTutorial::FORM]);
        $steps = $serializer->serialize($steps, 'json', ['groups' => HeStep::FORM]);

        return $this->render('user/pages/tutorials/update.html.twig', [
            'product' => $product,
            'elem' => $obj,
            'element' => $element,
            'steps' => $steps,
        ]);
    }

    #[Route('/tutoriel/{slug}', name: 'read', options: ['expose' => true])]
    public function read($p_slug, $slug, HeProductRepository $productRepository,
                         HeTutorialRepository $tutorialRepository, HeStepRepository $stepRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        if (!in_array($product->getId(), $this->getUser()->getAccess()) || (!$this->isGranted('ROLE_ADMIN') && $product->isIntern())) {
            throw $this->createAccessDeniedException("Vous n'êtes pas autorisé à accéder à ces informations.");
        }

        $obj = $tutorialRepository->findOneBy(['product' => $product, 'slug' => $slug]);

        if (!$obj || $obj->getStatus() == HelpStatut::Draft && !$this->isGranted('ROLE_ADMIN')) {
            throw $this->createAccessDeniedException("Cette page n'existe pas.");
        }

        if($obj->isTwig() && $obj->getTwigName()){
            $fileTwig = 'user/pages/tutorials/products/' . $product->getDirname() . '/' . $obj->getTwigName();
            if(!file_exists($this->getParameter('templates_directory') . $fileTwig)){
                throw $this->createNotFoundException('Cette page n\'existe pas.');
            }

            return $this->render($fileTwig, [
                'product' => $product,
                'elem' => $obj
            ]);
        }

        $steps = $stepRepository->findBy(['tutorial' => $obj]);

        return $this->render('user/pages/tutorials/read.html.twig', [
            'product' => $product,
            'elem' => $obj,
            'steps' => $steps,
        ]);
    }
}
