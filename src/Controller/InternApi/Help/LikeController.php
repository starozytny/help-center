<?php

namespace App\Controller\InternApi\Help;

use App\Entity\Enum\Help\HelpFavorite;
use App\Entity\Main\Help\HeDocumentation;
use App\Entity\Main\Help\HeLike;
use App\Entity\Main\Help\HeTutorial;
use App\Service\ApiResponse;
use App\Service\Data\DataHelp;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/intern/api/help/likes', name: 'intern_api_help_likes_')]
class LikeController extends AbstractController
{
    #[Route('/{type}/{id}/{answer}', name: 'like', options: ['expose' => true], methods: 'POST')]
    public function delete($type, $id, $answer, ManagerRegistry $registry, DataHelp $dataHelp, ApiResponse $apiResponse): Response
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

        $user = $this->getUser();

        $existe = $registry->getRepository(HeLike::class)->findOneBy([
            'user' => $user, 'type' => $type, 'identifiant' => $obj->getId()
        ]);

        $nbDislike = $obj->getNbDislike();
        $nbLike    = $obj->getNbLike();

        $returnValue = 1;
        if(!$existe){
            $new = $dataHelp->setDataLike(new HeLike(), $user, $obj->getId(), $type, $answer);
            $em->persist($new);

            if($answer == 0) $nbDislike++; else $nbLike++;
        }else{
            if($existe->getAnswer() == $answer){
                $em->remove($existe);
                $returnValue = 0;

                if($answer == 0) $nbDislike--; else $nbLike--;
            }else{
                if($answer == 0) {
                    $nbDislike++;
                    $nbLike--;
                } else {
                    $nbDislike--;
                    $nbLike++;
                }
            }

            $existe->setAnswer($answer);
        }

        $obj->setNbDislike($nbDislike);
        $obj->setNbLike($nbLike);

        $em->flush();
        return $apiResponse->apiJsonResponseCustom([
            'code' => $returnValue,
            'likes' => $nbLike,
            'dislikes' => $nbDislike,
        ]);
    }
}
