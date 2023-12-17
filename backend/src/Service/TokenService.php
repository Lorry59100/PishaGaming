<?php

namespace App\Service;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class TokenService
{
    private $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getUserFromRequest(Request $request): mixed
    {
        // Récupérez les en-têtes de la requête
        $headers = $request->headers;
        $authorizationHeader = $headers->get('Authorization');
        $bearerToken = null;

        if ($authorizationHeader && preg_match('/Bearer\s+(.+)/i', $authorizationHeader, $matches)) {
            $bearerToken = $matches[1];
        }

        // Trouver l'utilisateur par son adresse e-mail
        $user = $this->userRepository->findOneBy(['email' => $bearerToken]);

        if (!$user) {
            // L'utilisateur n'a pas été trouvé, gestion de l'erreur si nécessaire
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        return $user;
    }
}
