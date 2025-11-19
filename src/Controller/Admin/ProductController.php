<?php

namespace App\Controller\Admin;

use App\Entity\Main\Help\HeProduct;
use App\Repository\Main\Help\HeProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/produits', name: 'admin_products_')]
class ProductController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(HeProductRepository $productRepository): Response
    {
        $products = $productRepository->findAll();

        return $this->render('admin/pages/products/index.html.twig', [
            'products' => $products
        ]);
    }

    #[Route('/ajouter', name: 'create')]
    public function productCreate(): Response
    {
        return $this->render('admin/pages/products/create.html.twig');
    }

    #[Route('/modifier/{slug}', name: 'update')]
    public function productUpdate($slug, HeProductRepository $productRepository, SerializerInterface $serializer): Response
    {
        $obj = $productRepository->findOneBy(['slug' => $slug]);

        $element = $serializer->serialize($obj, 'json', ['groups' => HeProduct::FORM]);

        return $this->render('admin/pages/products/update.html.twig', [
            'elem' => $obj,
            'element' => $element,
        ]);
    }
}
