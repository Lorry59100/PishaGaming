<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Request;

class TokenService
{
    private $userRepository;
    private $jwtManager;

    public function __construct(UserRepository $userRepository, JWTTokenManagerInterface $jwtManager)
    {
        $this->userRepository = $userRepository;
        $this->jwtManager = $jwtManager;
    }

    public function getUserFromRequest(Request $request): ?User
    {
        $authorizationHeader = $request->headers->get('Authorization');

        if ($authorizationHeader && preg_match('/Bearer\s+(.+)/i', $authorizationHeader, $matches)) {
            $jwt = $matches[1];

            try {
                $data = $this->jwtManager->parse($jwt);

                if (isset($data['id'])) {
                    return $this->userRepository->find($data['id']);
                }
            } catch (\Exception $e) {
                // Log the exception or handle it as needed
                return null;
            }
        }

        return null;
    }
}

