<?php

namespace App\Controller\Admin;

use App\Entity\Main\User;
use App\Repository\Main\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/logs/historique', name: 'admin_logs_history_')]
class LogHistoryController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(UserRepository $userRepository, SerializerInterface $serializer): Response
    {
        $users = $userRepository->findAll();
        $users = $serializer->serialize($users, 'json', ['groups' => User::LOGS]);
        return $this->render('admin/pages/logs/index.html.twig', ['users' => $users]);
    }
}
