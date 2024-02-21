<?php

namespace App\Controller\Admin;

use App\Entity\Main\Settings;
use App\Entity\Main\Society;
use App\Service\SettingsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/societes', name: 'admin_societies_')]
class SocietyController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/societies/index.html.twig', ['highlight' => $request->query->get('h')]);
    }

    #[Route('/societe/ajouter', name: 'create', options: ['expose' => true])]
    public function create(SettingsService $settingsService, SerializerInterface $serializer): Response
    {
        $settings = $settingsService->getSettings();
        $settings = $serializer->serialize($settings, 'json', ['groups' => Settings::IS_MULTIPLE_DB]);

        return $this->render('admin/pages/societies/create.html.twig', ['settings' => $settings]);
    }

    #[Route('/societe/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(Society $elem, SettingsService $settingsService, SerializerInterface $serializer): Response
    {
        $settings = $settingsService->getSettings();

        $settings = $serializer->serialize($settings, 'json', ['groups' => Settings::IS_MULTIPLE_DB]);
        $obj      = $serializer->serialize($elem,     'json', ['groups' => Society::FORM]);

        return $this->render('admin/pages/societies/update.html.twig', ['elem' => $elem, 'obj' => $obj, 'settings' => $settings]);
    }

    #[Route('/societe/consulter/{id}', name: 'read', options: ['expose' => true])]
    public function read(Society $elem, SettingsService $settingsService): Response
    {
        $settings = $settingsService->getSettings();
        return $this->render('admin/pages/societies/read.html.twig', ['elem' => $elem, 'settings' => $settings]);
    }
}
