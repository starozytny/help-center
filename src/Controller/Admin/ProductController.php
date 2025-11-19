<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/changelogs', name: 'admin_changelogs_')]
class ProductController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/changelogs/index.html.twig', ['highlight' => $request->query->get('h')]);
    }
}
