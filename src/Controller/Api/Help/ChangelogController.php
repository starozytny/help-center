<?php

namespace App\Controller\Api\Help;

use App\Entity\Main\Help\HeChangelog;
use App\Repository\Main\Help\HeChangelogRepository;
use App\Service\ApiResponse;
use App\Service\Changelogs\ChangelogsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

#[Route('/api/help/changelogs', name: 'api_help_changelogs_')]
#[IsGranted('ROLE_ADMIN')]
class ChangelogController extends AbstractController
{
    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    #[Route('/generate/range/{fromNumVersion}/{toNumVersion}', name: 'generate_by_range', methods: 'POST')]
    public function generateByRange($fromNumVersion, $toNumVersion, ApiResponse $apiResponse,
                                    HeChangelogRepository $repository, ChangelogsService $changelogsService): Response
    {
        $fromObj = $repository->findOneBy(['numVersion' => $fromNumVersion], ['numero' => 'ASC']);
        $toObj = $repository->findOneBy(['numVersion' => $toNumVersion], ['numero' => 'DESC']);

        if(!$fromObj || !$toObj){
            return $apiResponse->apiJsonResponseBadRequest('Vérifiez les numéros de version renseignés.');
        }

        if($fromObj->getNumero() > $toObj->getNumero()){
            return $apiResponse->apiJsonResponseBadRequest('La version ' . $fromNumVersion . ' est supérieur à la version ' . $toNumVersion . '.');
        }

        $objs = $repository->findBetweenNumeros($fromObj->getNumero(), $toObj->getNumero());
        $filename = $changelogsService->createFile($toObj, $objs);

        $folder = $changelogsService->getFolderGenerated($toObj->getProduct());
        $file = $folder . $filename;

        if(!file_exists($file)){
            throw $this->createNotFoundException("Fichier HTML introuvable.");
        }

        $html = file_get_contents($file);

        return $apiResponse->apiJsonResponseCustom($html);
    }
}
