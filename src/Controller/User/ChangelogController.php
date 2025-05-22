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
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index($p_slug, HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);

        $objs = $product->getChangelogs();

        return $this->render('user/pages/changelogs/index.html.twig', [
            'product' => $product,
            'changelogs' => $objs
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

    #[Route('/modifier/{slug}', name: 'update', options: ['expose' => true])]
    public function update($p_slug, $slug, HeChangelogRepository $changelogRepository,
                           HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $product = $productRepository->findOneBy(['slug' => $p_slug]);
        $obj = $changelogRepository->findOneBy(['slug' => $slug]);

        $element = $serializer->serialize($obj, 'json', ['groups' => HeChangelog::FORM]);

        return $this->render('user/pages/changelogs/update.html.twig', [
            'product' => $product,
            'elem' => $obj,
            'element' => $element
        ]);
    }
}
