<?php

namespace App\Controller\User;

use App\Entity\Enum\Help\HelpStatut;
use App\Entity\Main\Help\HeDocumentation;
use App\Repository\Main\Help\HeDocumentationRepository;
use App\Repository\Main\Help\HeProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/espace-membre/produits/produit/{p_slug}/documentations', name: 'user_help_documentation_')]
class DocumentationController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index($p_slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        if (!in_array($product->getId(), $this->getUser()->getAccess())) {
            throw $this->createAccessDeniedException("Vous n'êtes pas autorisé à accéder à ces informations.");
        }

        $objs = $product->getDocumentations();

        return $this->render('user/pages/documentations/index.html.twig', [
            'product' => $product,
            'documentations' => $objs
        ]);
    }

    #[Route('/ajouter', name: 'create')]
    #[IsGranted('ROLE_ADMIN')]
    public function create($p_slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        return $this->render('user/pages/documentations/create.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/modifier/{slug}', name: 'update', options: ['expose' => true])]
    #[IsGranted('ROLE_ADMIN')]
    public function update($p_slug, $slug, HeDocumentationRepository $documentationRepository,
                                        HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);
        $obj = $documentationRepository->findOneBy(['slug' => $slug]);

        $element = $serializer->serialize($obj, 'json', ['groups' => HeDocumentation::FORM]);

        return $this->render('user/pages/documentations/update.html.twig', [
            'product' => $product,
            'elem' => $obj,
            'element' => $element,
        ]);
    }

    #[Route('/documentation/{slug}', name: 'read', options: ['expose' => true])]
    public function read($p_slug, $slug, HeProductRepository $productRepository, HeDocumentationRepository $documentationRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        if (!in_array($product->getId(), $this->getUser()->getAccess()) || (!$this->isGranted('ROLE_ADMIN') && $product->isIntern())) {
            throw $this->createAccessDeniedException("Vous n'êtes pas autorisé à accéder à ces informations.");
        }

        $obj = $documentationRepository->findOneBy(['product' => $product, 'slug' => $slug]);

        if ($obj->getStatus() == HelpStatut::Draft && !$this->isGranted('ROLE_ADMIN')) {
            throw $this->createAccessDeniedException("Cette page n'existe pas.");
        }

        if($obj->isTwig() && $obj->getTwigName()){
            $fileTwig = 'user/pages/documentations/products/' . $product->getDirname() . '/' . $obj->getTwigName();
            if(!file_exists($this->getParameter('templates_directory') . $fileTwig)){
                throw $this->createNotFoundException('Cette page n\'existe pas.');
            }

            return $this->render($fileTwig, [
                'product' => $product,
                'elem' => $obj
            ]);
        }

        return $this->render('user/pages/documentations/read.html.twig', [
            'product' => $product,
            'elem' => $obj,
        ]);
    }
}
