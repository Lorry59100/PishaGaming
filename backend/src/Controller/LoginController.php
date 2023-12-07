<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\User;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class LoginController extends AbstractController
{
    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager, 
    ProductRepository $productRepository, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'];
        $password = $data['password'];
        $cart = $data['cart'] ?? []; // Retrieve the cart information

        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user && $passwordHasher->isPasswordValid($user, $password)) {
            $payload = [
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'id' => $user->getId(),
            ];
            $token = $jwtManager->createFromPayload($user, $payload);
            // Check if the user has a cart
            if ($cart) {
            $this->createCartEntities($user, $productRepository ,$cart, $entityManager);
            }
 
            return new JsonResponse([
                'user'  => $user->getUserIdentifier(),
                'token' => $token,
            ]);
        }
        return new JsonResponse(['message' => 'Identifiants invalides'], 401);
       
    }

    private function createCartEntities(User $user, ProductRepository $productRepository, array $cartItems, EntityManagerInterface $entityManager)
    {
        foreach ($cartItems as $cartItem) {
            $product = $productRepository->findOneBy(['id' => $cartItem['id']]);
            $existingCartItem = $entityManager->getRepository(Cart::class)->findOneBy([
                'user' => $user,
                'product' => $product,
                'platform' => $cartItem['platform'],
        ]);

        if ($existingCartItem) {
            // If the product is already in the cart, update quantity and price
            $existingCartItem->setQuantity($existingCartItem->getQuantity() + $cartItem['quantity']);
        } else {
            // If the product is not in the cart, create a new cart entity
            $cartEntity = new Cart();
            $cartEntity
            ->setUser($user)
            ->setProduct($product)
            ->setQuantity($cartItem['quantity'])
            ->setPlatform($cartItem['platform']);
            // Add the Cart entity to the EntityManager
            $entityManager->persist($cartEntity);
            }
        }
        // Flush all changes to the database
        $entityManager->flush();
    }
}
