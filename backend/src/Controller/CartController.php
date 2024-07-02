<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\Product;
use App\Repository\CartRepository;
use App\Repository\PlatformRepository;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CartController extends AbstractController
{
    /* #[Route('/cart', name: 'app_cart')]
    public function index(): Response
    {
        return $this->render('cart/index.html.twig', [
            'controller_name' => 'CartController',
        ]);
    } */

    /**
     * @Route("/add-to-cart/{id}", name="add_to_cart", methods={"POST"})
     */
    public function addToCart(Request $request, $id, ProductRepository $productRepository, UserRepository $userRepository, EntityManagerInterface $entityManager,
    CartRepository $cartRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        //Récuperer le produit
        $product = $productRepository->find($id);

        // Vérifier si le produit existe
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found.'], 404);
        }

        // Récupérer l'utilisateur connecté (vous devrez implémenter votre propre logique d'authentification ici)
        $userId = $data['userId'];
        $user = $userRepository->find($userId);

        // Vérifier si l'utilisateur est connecté
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated.'], 401);
        }

        $existingCartItem = $cartRepository->findOneBy([
            'user' => $user,
            'product' => $product,
            'platform' => $data['platform'],
        ]);
        
        if ($existingCartItem) {
            // Si l'élément existe déjà, mettez à jour la quantité par exemple
            $existingCartItem->setQuantity($existingCartItem->getQuantity() + $data['quantity']);
            $entityManager->persist($existingCartItem);
            $entityManager->flush();
        } else {
            // Si l'élément n'existe pas, créez une nouvelle entité Cart
            $cartItem = new Cart();
            $cartItem->setQuantity($data['quantity']);
            $cartItem->setPlatform($data['platform']);
            $cartItem->setProduct($product);
            $cartItem->setUser($user);
            $entityManager->persist($cartItem);
            $entityManager->flush();
        }

        return new JsonResponse(['success' => true, 'message' => 'Product added to cart.']);
        }

    /**
     * @Route("/get-storage", name="get_storage", methods={"GET"})
     */
    public function getStorage(Request $request, PlatformRepository $platformRepository, ProductRepository $productRepository, UserRepository $userRepository,
    CartRepository $cartRepository): JsonResponse
    {
        $ids = $request->query->get('ids');

        if (!$ids) {
            return new JsonResponse(['error' => 'IDs manquants.'], 400);
        }
    
        $ids = is_array($ids) ? $ids : explode(',', $ids);
    
        $products = $productRepository->findBy(['id' => $ids]);
    
        $productsArray = [];
    
        foreach ($products as $product) {
            $productArray = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'oldPrice' => $product->getOldPrice(),
                'price' => $product->getPrice(),
                /* 'isPhysical' => $product->getPlatform(), */
                // Ajoutez d'autres propriétés du produit selon vos besoins
            ];
    
            $productsArray[] = $productArray;
        }
    
        return new JsonResponse($productsArray, 200);
    }

    /**
     * @Route("/get-cart/{id}", name="get_cart", methods={"GET"})
     */
    public function getCart(Request $request, $id, PlatformRepository $platformRepository, ProductRepository $productRepository, UserRepository $userRepository,
    CartRepository $cartRepository): JsonResponse
    {
    $carts = $cartRepository->findBy(['user' => $id]);
    $cartsData = [];

    foreach ($carts as $cart) {
    $platform = $platformRepository->findOneBy(['name' => $cart->getPlatform()]);
    $cartData = [
    'id' => $cart->getId(),
    'quantity' => $cart->getQuantity(),
    'platform' => $cart->getPlatform(),
    'img' => $cart->getProduct()->getImg(),
    'productId' => $cart->getProduct()->getId(),
    'name' => $cart->getProduct()->getName(),
    'oldPrice' => $cart->getProduct()->getOldPrice(),
    'price' => $cart->getProduct()->getPrice(),
    'isPhysical' => $platform->isIsPhysical(),
    ];

    $cartsData[] = $cartData;
    }
    return new JsonResponse($cartsData, 200);
    }

    /**
     * @Route("/update-cart}", name="update_cart", methods={"PUT"})
     */
    public function updateCart(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager): JsonResponse
    {
    $data = json_decode($request->getContent(), true);
    $itemId = $data['itemId'];
    $quantity = $data['quantity'];
    $itemToUpdate = $cartRepository->find($itemId);
    $itemToUpdate->setQuantity($quantity);
    $entityManager->persist($itemToUpdate);
    $entityManager->flush();
    return new JsonResponse($itemToUpdate, 200);
    }

    /**
     * @Route("/delete-item}", name="delete_item", methods={"DELETE"})
     */
    public function deleteItem(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager): JsonResponse
    {
    $data = json_decode($request->getContent(), true);
    $itemId = $data['itemId'];
    $itemToUpdate = $cartRepository->find($itemId);
    $entityManager->remove($itemToUpdate);
    $entityManager->flush();
    return new JsonResponse($itemToUpdate, 200);
    }
}
