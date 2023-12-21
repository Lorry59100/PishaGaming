<?php

namespace App\Controller;

use App\Service\EmailService;
use App\Service\TokenService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ParametersController extends AbstractController
{

    private $emailService;
    private $tokenService;

    public function __construct(TokenService $tokenService, EmailService $emailService)
    {
        $this->tokenService = $tokenService;
        $this->emailService = $emailService;
    }
    
    /**
     * @Route("/change-mail", name="change_mail", methods={"POST"})
     */
    public function changeMail(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->tokenService->getUserFromRequest($request);
        /* dd($user); */
        $email = $data['mail'];

        //Vérifier si l'utilisateur existe en BDD
        $userInDb = $userRepository->findOneBy(['email' => $email]);
        if($userInDb) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        //Vérifier si le mail à update existe déja en BDD
        $newMailInDb = $userRepository->findOneBy(['mailToUpdate' => $email]);
        if($newMailInDb) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $password = $data['password'];
        if ($user && $passwordHasher->isPasswordValid($user, $password)) {
            /* Créer un token */
            $randomString = bin2hex(random_bytes(16));
            $timestamp = time();
            $expirationTimestamp = $timestamp + 86400;
            $dateTime = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
            $dateTime->setTimestamp($expirationTimestamp);
            $token = $randomString . $timestamp;
            $user->setTokenMail($token);
            $user->setMailExpiration($dateTime);
            $user->setMailToUpdate($email);
            $em->persist($user);
            $em->flush();

            $this->emailService->sendWithTemplate(
                'pishagaming.noreply@gmail.com',
                $email,
                'Changement de votre adresse mail',
                'emails/changemail.html.twig',
                [
                    'token' => $user->getTokenMail(),
                ]
            );
        }

        return new JsonResponse(['message' => 'un mail d\'activation a été envoyé à votre nouvelle adresse'], 200);
    }

    /**
     * @Route("/check-mail", name="check_mail", methods={"POST"})
     */
    public function checkMail(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'];
        $user = $userRepository->findOneBy(['tokenMail' => $token]);
        $email = $user->getMailToUpdate();
        
        $now = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
        $expirationDate = new \DateTime($user->getMailExpiration()->format('Y-m-d H:i:s'), new \DateTimeZone('Europe/Paris'));

        if ($expirationDate > $now) {
            $user->setEmail($email);
            $user->setMailExpiration(null);
            $user->setTokenMail(null);
            $user->setMailToUpdate(null);
            $em->persist($user);
            $em->flush();
        } else {
            // Le token n'est pas valide
            return new JsonResponse(['error' => 'Votre lien a expiré.', JsonResponse::HTTP_BAD_REQUEST]);
        }
        return new JsonResponse(['message' => 'Votre adresse mail a bien été changé !']);
    }
}
