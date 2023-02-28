<?php

namespace App\Controller;

use App\Repository\Main\Help\HeFavoriteRepository;
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
    #[Route('/favoris', name: 'favorite')]
    public function favorite(HeFavoriteRepository $favoriteRepository): Response
    {
        return $this->render('user/pages/profil/favorite.html.twig');
    }
}
