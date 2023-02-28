<?php

namespace App\Controller\Api\Help;

use App\Entity\Enum\Help\HelpFavorite;
use App\Entity\Main\Help\HeDocumentation;
use App\Entity\Main\Help\HeFavorite;
use App\Entity\Main\Help\HeTutorial;
use App\Service\ApiResponse;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/help/favorites', name: 'api_help_favorites_')]
class FavoriteController extends AbstractController
{
    #[Route('/{type}/{id}', name: 'favorite', options: ['expose' => true], methods: 'POST')]
    public function delete($type, $id, ManagerRegistry $registry, ApiResponse $apiResponse): Response
    {
        $em = $registry->getManager();

        $classe = match ((int) $type) {
            HelpFavorite::Tutorial => HeTutorial::class,
            HelpFavorite::Documentation => HeDocumentation::class,
        };

        $obj = $em->getRepository($classe)->findOneBy(['id' => $id]);
        if(!$obj){
            return $apiResponse->apiJsonResponseBadRequest('Objet introuvable');
        }

        $existe = $em->getRepository(HeFavorite::class)->findOneBy([
            'type' => $type,
            'user' => $this->getUser(),
            'identifiant' => $obj->getId()
        ]);

        if($existe){
            $em->remove($existe);
            $returnValue = 0;
        }else{
            $fav = (new HeFavorite())
                ->setType($type)
                ->setUser($this->getUser())
                ->setIdentifiant($obj->getId())
            ;

            $em->persist($fav);
            $returnValue = 1;
        }

        $em->flush();
        return $apiResponse->apiJsonResponseCustom(['code' => $returnValue]);
    }
}
