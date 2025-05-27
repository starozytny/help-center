<?php

namespace App\Controller\User;

use App\Entity\Main\Help\HeChangelog;
use App\Repository\Main\Help\HeChangelogRepository;
use App\Repository\Main\Help\HeProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/espace-membre/produits/produit/{p_slug}/changelogs', name: 'user_help_changelogs_')]
#[IsGranted('ROLE_ADMIN')]
class ChangelogController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true], methods: 'GET')]
    public function index($p_slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        return $this->render('user/pages/changelogs/index.html.twig', [
            'product' => $product
        ]);
    }

    #[Route('/ajouter', name: 'create')]
    public function create($p_slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        return $this->render('user/pages/changelogs/create.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/modifier/{id}', name: 'update', options: ['expose' => true], methods: 'GET')]
    public function update($p_slug, $id, HeChangelogRepository $changelogRepository,
                           HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);
        $obj = $changelogRepository->findOneBy(['id' => $id]);

        $element = $serializer->serialize($obj, 'json', ['groups' => HeChangelog::FORM]);

        return $this->render('user/pages/changelogs/update.html.twig', [
            'product' => $product,
            'elem' => $obj,
            'element' => $element
        ]);
    }

    #[Route('/apercu/html/{id}', name: 'preview_html', options: ['expose' => true], methods: 'GET')]
    public function previewHtml($p_slug, HeChangelog $obj): Response
    {
        if(!$obj->getFilename()){
            $this->addFlash('error', 'Veuillez générer le fichier pour voir l\'aperçu.');
            return $this->redirectToRoute('user_help_changelogs_index', ['p_slug' => $p_slug]);
        }

        $file = $this->getParameter('private_directory') . '/export/generated/' . $obj->getFilename();

        if(!file_exists($file)){
            throw $this->createNotFoundException("Fichier HTML introuvable.");
        }

        $html = file_get_contents($file);

        return new Response($html, 200, ['Content-Type' => 'text/html']);
    }
}
