<?php

namespace App\Controller\InternApi;

use App\Entity\Main\LogHistory;
use App\Repository\Main\LogHistoryRepository;
use App\Service\Api\ApiResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/logs/history', name: 'intern_api_logs_history_')]
#[IsGranted('ROLE_ADMIN')]
class LogsHistoryController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(LogHistoryRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findAll(), LogHistory::LIST);
    }
}
