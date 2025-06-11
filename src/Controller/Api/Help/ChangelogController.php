<?php

namespace App\Controller\Api\Help;

use App\Repository\Main\Help\HeChangelogRepository;
use App\Repository\Main\Help\HeProductRepository;
use App\Service\ApiResponse;
use App\Service\Changelogs\ChangelogsService;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

#[Route('/api/help/changelogs', name: 'api_help_changelogs_')]
#[IsGranted('ROLE_ADMIN')]
#[OA\Tag(name: 'Changelog')]
#[OA\Response(
    response: 401,
    description: 'Accès non autorisé',
)]
class ChangelogController extends AbstractController
{
    /**
     * Génère un changelog HTML entre deux versions.
     *
     * Cette route permet de générer un changelog HTML entre deux numéros de version donnés.

     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    #[OA\Parameter(
        name: 'productUid',
        description: "Uid du produit",
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'fromNumVersion',
        description: "Version de départ (ex: 1.0.0)",
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'toNumVersion',
        description: "Version d'arrivée (ex: 2.0.0)",
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Response(
        response: 200,
        description: 'Changelog généré au format HTML',
        content: new OA\MediaType(
            mediaType: 'text/html',
            schema: new OA\Schema(
                type: 'string',
                example: '<html><body><h1>Changelog..</h1></body></html>'
            )
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Vérifiez l\'existence des numéros de version renseignés. <br/> ou <br/> La version fromNumVersion est supérieur à la version toNumVersion. <br/> ou <br/> Produit inconnu.',
        content: new OA\MediaType(
            mediaType: 'application/json',
            schema: new OA\Schema(
                properties: [
                    new OA\Property(property: 'message', type: 'string', example: 'Message d\'erreur...')
                ],
                type: 'object'
            )
        )
    )]
    #[Route('/generate/range/{productUid}/{fromNumVersion}/{toNumVersion}', name: 'generate_by_range', methods: 'POST')]
    public function generateByRange($productUid, $fromNumVersion, $toNumVersion, ApiResponse $apiResponse,
                                    HeChangelogRepository $repository, ChangelogsService $changelogsService,
                                    HeProductRepository $productRepository): Response
    {
        $product = $productRepository->findOneBy(['uid' => $productUid]);

        if(!$product){
            return $apiResponse->apiJsonResponseBadRequest('Produit inconnu.');
        }

        $fromObj = $repository->findOneBy(['product' => $product, 'numVersion' => $fromNumVersion], ['numero' => 'ASC']);
        $toObj = $repository->findOneBy(['product' => $product, 'numVersion' => $toNumVersion], ['numero' => 'DESC']);

        if(!$fromObj || !$toObj){
            return $apiResponse->apiJsonResponseBadRequest('Vérifiez l\'existence des numéros de version renseignés.');
        }

        if($fromObj->getNumero() > $toObj->getNumero()){
            return $apiResponse->apiJsonResponseBadRequest('La version ' . $fromNumVersion . ' est supérieur à la version ' . $toNumVersion . '.');
        }

        $objs = $repository->findBetweenNumeros($fromObj->getNumero(), $toObj->getNumero());
        $html = $changelogsService->createHtml($toObj, $objs);

        return new Response($html, 200, ['Content-Type' => 'text/html']);
    }
}
