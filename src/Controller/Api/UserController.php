<?php

namespace App\Controller\Api;

use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\Society;
use App\Entity\Main\User;
use App\Repository\Main\UserRepository;
use App\Service\Api\ApiResponse;
use App\Service\Data\DataMain;
use App\Service\ValidatorService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;

#[Route('/api/users', name: 'api_users_')]
#[IsGranted('ROLE_ADMIN')]
#[OA\Tag(name: 'Utilisateurs')]
#[OA\Response(
    response: 401,
    description: 'Accès non autorisé',
)]
class UserController extends AbstractController
{
    /**
     * Récupère la liste des utilisateurs qui ne sont pas bloquée.
     */
    #[Route('/list', name: 'list', methods: 'GET')]
    public function list(UserRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse(
            $repository->findBy(['isBlocked' => false], ['firstname' => 'ASC']),
            User::EXTERNAL_SELECT
        );
    }

    /**
     * Récupère les informations de l'utilisateur actuel
     */
    #[Route('/me', name: 'me', methods: 'GET')]
    public function me(ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse(
            $this->getUser(),
            User::ME
        );
    }

    /**
     * Créer un utilisateur selon la société
     */
    #[Route('/sync/user', name: 'sync_user', methods: 'POST')]
    public function syncUser(Request $request, ManagerRegistry $doctrine,
                                    UserRepository $repository, ApiResponse $apiResponse,
                                    DataMain $dataEntity, ValidatorService $validator,
                                    UserPasswordHasherInterface $passwordHasher): NotFoundHttpException|JsonResponse
    {
        $em = $doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $society = $em->getRepository(Society::class)->findOneBy(['code' => 999]);
        if(!$society) return $this->createNotFoundException('Society not found.');

        $existe = $em->getRepository(User::class)->findOneBy(['societyCode' => $data->societyCode]);

        $obj = $dataEntity->setDataUserFromAPI($existe ?: new User(), $data);
        $obj->setPassword($passwordHasher->hashPassword($obj, uniqid()));

        $obj->setSociety($society);
        $obj->setManager($society->getManager());

        $i = 0;
        $existe = $em->getRepository(User::class)->findOneBy(['username' => $obj->getUsername()]);
        while($existe && $existe->getUsername() == $obj->getUsername()){
            $obj->setUsername($obj->getUsername() . "-" . $i++);

            $existe = $em->getRepository(User::class)->findOneBy(['username' => $obj->getUsername()]);
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponseCustom(['token' => $obj->getToken()]);
    }


    /**
     * Accorde l'accès à un utilisateur à un produit
     */
    #[Route('/access/add/{token}', name: 'access_add', methods: 'PUT')]
    public function addAccess(Request $request, User $obj, ManagerRegistry $doctrine,
                              UserRepository $repository, ApiResponse $apiResponse,
                              ValidatorService $validator): NotFoundHttpException|JsonResponse
    {
        $em = $doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $products = $em->getRepository(HeProduct::class)->findBy(['name' => $data->access]);

        $access = [];
        foreach($products as $product){
            $access[] = $product->getId();
        }

        $access = array_merge($obj->getAccess(), $access);
        $access = array_unique($access);
        $obj->setAccess($access);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
