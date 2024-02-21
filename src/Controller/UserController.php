<?php

namespace App\Controller;

use App\Entity\Enum\Help\HelpFavorite;
use App\Repository\Main\Help\HeFavoriteRepository;
use App\Repository\Main\Help\HeProductRepository;
use App\Repository\Main\Help\HeTutorialRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

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
    public function favorite(HeFavoriteRepository $favoriteRepository, HeTutorialRepository $tutorialRepository): Response
    {
        $favorites = $favoriteRepository->findBy(['user' => $this->getUser()]);

        $tutorialsId = [];
        foreach ($favorites as $fav){
            switch ($fav->getType()){
                case HelpFavorite::Tutorial:
                    $tutorialsId[] = $fav->getIdentifiant();
                    break;
                default: break;
            }
        }

        $tutorials = $tutorialRepository->findBy(['id' => $tutorialsId]);

        return $this->render('user/pages/profil/favorite.html.twig', [
            'tutorials' => $tutorials
        ]);
    }
}
