<?php

namespace App\Controller\Api\Help;

use App\Service\ApiResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/help/changelogs', name: 'api_help_changelogs_')]
#[IsGranted('ROLE_ADMIN')]
class ChangelogController extends AbstractController
{
    #[Route('/generate', name: 'generate', methods: 'POST')]
    public function save(Request $request, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
