<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Cart;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;

class CartService
{
    private $productRepository;
    private $entityManager;

    public function __construct(ProductRepository $productRepository, EntityManagerInterface $entityManager)
    {
        $this->productRepository = $productRepository;
        $this->entityManager = $entityManager;
    }

    public function createCartEntities(User $user, array $cartItems)
    {
        foreach ($cartItems as $cartItem) {
            $product = $this->productRepository->findOneBy(['id' => $cartItem['id']]);
            $existingCartItem = $this->entityManager->getRepository(Cart::class)->findOneBy([
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
                $this->entityManager->persist($cartEntity);
            }

            // Update the product stock
            $product->setStock($product->getStock() - $cartItem['quantity']);
            $this->entityManager->persist($product);
        }
        // Flush all changes to the database
        $this->entityManager->flush();
    }
}
