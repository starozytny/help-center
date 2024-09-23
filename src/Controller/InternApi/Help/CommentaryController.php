<?php

namespace App\Controller\InternApi\Help;

use App\Entity\Main\Help\HeCommentary;
use App\Entity\Main\User;
use App\Repository\Main\Help\HeCommentaryRepository;
use App\Repository\Main\Help\HeDocumentationRepository;
use App\Repository\Main\Help\HeTutorialRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataHelp;
use App\Service\MailerService;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/help/commentaries', name: 'intern_api_help_commentaries_')]
class CommentaryController extends AbstractController
{
    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataHelp $dataEntity, HeCommentaryRepository $repository,
                           MailerService $mailerService, SettingsService $settingsService,
                           HeDocumentationRepository $documentationRepository, HeTutorialRepository $tutorialRepository): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $type = $data->type;
        $obj = $dataEntity->setDataCommentary(new HeCommentary(), $data, $user);

        if($type == "documentation"){
            $reference = $documentationRepository->findOneBy(['id' => $data->referenceId]);
            $obj->setDocumentation($reference);
        }else if($type == "tutorial"){
            $reference = $tutorialRepository->findOneBy(['id' => $data->referenceId]);
            $obj->setTutorial($reference);
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);

        if(!$mailerService->sendMail(
            [$settingsService->getEmailContact()],
            "Commentaire en " . $type,
            "Commentaire en " . $type,
            'app/email/help/commentary.html.twig',
            ['type' => $type, 'elem' => $obj, 'settings' => $settingsService->getSettings()],
        )) {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'to',
                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
            ]]);
        }

        return $apiResponse->apiJsonResponseSuccessful("Message envoyé.");
    }
}
