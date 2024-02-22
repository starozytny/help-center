<?php

namespace App\Controller\Api;

use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\Society;
use App\Entity\Main\User;
use App\Repository\Main\UserRepository;
use App\Service\ApiResponse;
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

#[Route('/api/users', name: 'api_users_')]
#[IsGranted('ROLE_ADMIN')]
class UserController extends AbstractController
{
    #[Route('/list', name: 'list', methods: 'GET')]
    public function list(UserRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse(
            $repository->findBy(['blocked' => false], ['firstname' => 'ASC']),
            User::EXTERNAL_SELECT
        );
    }

    #[Route('/create/user/by/society', name: 'create_by_society', methods: 'POST')]
    public function createBySociety(Request $request, ManagerRegistry $doctrine,
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

        $obj = $dataEntity->setDataUserFromAPI(new User(), $data);
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
