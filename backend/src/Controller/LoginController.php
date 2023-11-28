<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class LoginController extends AbstractController
{
    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager)
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'];
        $password = $data['password'];

        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user && $passwordHasher->isPasswordValid($user, $password)) {
            $payload = [
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'role' => $user->getRoles(),
                'id' => $user->getId(),
            ];
            $token = $jwtManager->create($user, $payload);
            return $this->json([
                'user'  => $user->getUserIdentifier(),
                'token' => $token,
            ]);
            // Utilisateur authentifié
            return new JsonResponse(['message' => 'Connexion réussie'], 200);
        }

        return new JsonResponse(['message' => 'Identifiants invalides'], 401);
       
    }
}
