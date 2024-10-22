<?php

namespace App\Controller;

use App\Entity\Main\LogHistory;
use App\Entity\Main\User;
use App\Repository\Main\LogHistoryRepository;
use App\Repository\Main\UserRepository;
use App\Service\Expiration;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{

    #[Route('/connexion', name: 'app_login', options: ['expose' => true])]
    public function index(AuthenticationUtils $authenticationUtils): Response
    {
        if ($this->getUser()) {
            if($this->isGranted('ROLE_ADMIN')) return $this->redirectToRoute('user_homepage');
            if($this->isGranted('ROLE_USER')) return $this->redirectToRoute('user_homepage');
        }

        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('app/pages/security/index.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error
        ]);
    }

    #[Route('/connected', name: 'app_logged')]
    public function logged(ManagerRegistry $registry): RedirectResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if ($user) {
            $user->setLastLoginAt(new \DateTime());
            $registry->getManager()->flush();

            if($this->isGranted('ROLE_ADMIN')) return $this->redirectToRoute('user_homepage');
            if($this->isGranted('ROLE_USER')) return $this->redirectToRoute('user_homepage');
        }

        return $this->redirectToRoute('app_login');
    }

    /**
     * @throws Exception
     */
    #[Route('/logout', name: 'app_logout', methods: ['GET'])]
    public function logout()
    {
        // controller can be blank: it will never be called!
        throw new Exception('Don\'t forget to activate logout in security.yaml');
    }

    #[Route('/reinitialisation/mot-de-passe/{token}-{code}', name: 'app_password_reinit', methods: ['GET'])]
    public function reinit($token, $code, UserRepository $repository, Expiration $expiration): Response
    {
        $user = $repository->findOneBy(['token' => $token]);
        if(!$user){
            throw new NotFoundHttpException("Cet utilisateur n'existe pas.");
        }

        if((!$user->getLostAt() || !$user->getLostCode())
            || ($user->getLostCode() && $user->getLostCode() != $code)){
            return $this->render('app/pages/security/reinit.html.twig', ['error' => true]);
        }

        if($user->getLostAt()){
            if ($expiration->isExpiredByMinutes($user->getLostAt(), new \DateTime(), 30)) {
                return $this->render('app/pages/security/reinit.html.twig', ['error' => true]);
            }
        }

        return $this->render('app/pages/security/reinit.html.twig', ['token' => $token]);
    }

    #[Route('/auto-connect/{token}', name: 'auto_connect')]
    public function autoConnect(Request $request, $token, UserRepository $repository, Security $security,
                                LogHistoryRepository $historyRepository): Response
    {
        $user = $repository->findOneBy(['token' => $token]);

        if($user){
            $security->login($user);

            $page = $request->query->get('page');
            if($page){
                if($user->getHighRoleCode() == User::CODE_ROLE_USER){
                    $this->createLogHistory($request, $historyRepository, $token);
                }

                if($type = $request->query->get('type')){
                    $slug = $request->query->get('slug');

                    if($type == "documentations"){
                        return $this->redirectToRoute('user_help_documentation_read', ['p_slug' => $page, 'slug' => $slug]);
                    }else if($type == "tutoriels"){
                        return $this->redirectToRoute('user_help_tutorial_read', ['p_slug' => $page, 'slug' => $slug]);
                    }else if($type == "faq"){
                        $category = $request->query->get('cat');
                        $id = $request->query->get('id');
                        return $this->redirectToRoute('user_help_question_read', ['slug' => $page, 'category' => $category, 'id' => $id]);
                    }
                }

                return $this->redirectToRoute('user_help_product_read', ['slug' => $page]);
            }
        }

        return $this->redirectToRoute('app_login');
    }

    private function createLogHistory(Request $request, LogHistoryRepository $historyRepository, $token): void
    {
        $urlUsed = $request->query->get('page') . "/" . $request->query->get('type', 'null') . "/" . $request->query->get('slug', 'null');

        $obj = (new LogHistory())
            ->setWho($request->query->get('who', $token))
            ->setUrlUsed($urlUsed)
        ;

        $historyRepository->save($obj, true);
    }
}
