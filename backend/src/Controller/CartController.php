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

        // Récupérer tous les éléments du panier de l'utilisateur
        $cartItems = $cartRepository->findBy(['user' => $user]);

        // Calculer le montant total actuel du panier
        $totalAmount = 0;
        foreach ($cartItems as $cartItem) {
            $totalAmount += $cartItem->getQuantity() * $cartItem->getProduct()->getPrice();
        }

        // Calculer le montant total après l'ajout du nouveau produit
        $newTotalAmount = $totalAmount + ($data['quantity'] * $product->getPrice());

        // Vérifier si le montant total dépasse 400 euros
        if ($newTotalAmount > 40000) {
            return new JsonResponse(['error' => 'Le montant total du panier dépasse 400 euros.'], 400);
        }

        $existingCartItem = $cartRepository->findOneBy([
            'user' => $user,
            'product' => $product,
            'platform' => $data['platform'],
        ]);
        
        if ($existingCartItem) {
            // Si l'élément existe déjà, mettez à jour la quantité par exemple
            if($existingCartItem->getQuantity() >= 10) {
                return new JsonResponse(['error' => 'Vous avez atteint la quantité maximale pour ce produit. Quantité maximale : 10.'], 401);
            }
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

        // Décrémenter la quantité du produit en stock
        $product->setStock($product->getStock() - $data['quantity']);
        $entityManager->persist($product);
        $entityManager->flush();

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
            ];
    
            $productsArray[] = $productArray;
        }
    
        return new JsonResponse($productsArray, 200);
    }

    /**
 * @Route("/get-cart/{id}", name="get_cart", methods={"GET"})
 */
public function getCart(Request $request, $id, PlatformRepository $platformRepository, ProductRepository $productRepository, UserRepository $userRepository,
CartRepository $cartRepository, EntityManagerInterface $entityManager): JsonResponse
{
    $carts = $cartRepository->findBy(['user' => $id]);
    $cartsData = [];
    $hasUpdates = false; // Drapeau pour vérifier si des mises à jour ont été effectuées

    foreach ($carts as $cart) {
        $product = $cart->getProduct();
        $availableQuantity = $product->getStock(); // Supposons que getQuantity() retourne la quantité disponible en BDD

        // Vérifier si la quantité dans le panier dépasse la quantité disponible
        if ($cart->getQuantity() > $availableQuantity) {
            // Mettre à jour la quantité dans le panier
            $cart->setQuantity($availableQuantity);
            $entityManager->persist($cart);
            $entityManager->flush();

            // Mettre à jour le drapeau
            $hasUpdates = true;
        }

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
            'category' => $cart->getProduct()->getCategory()->getName(),
        ];

        $cartsData[] = $cartData;
    }

    $message = '';
    if($hasUpdates == true) {
        $message = 'Certains produits n\'étant plus ou insuffisamment disponibles, votre panier a été mis à jour.';
    }

    // Ajouter les messages à la réponse JSON
    $responseData = [
        'carts' => $cartsData,
        'message' => $message
    ];

    return new JsonResponse($responseData, 200);
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
    if (!$itemToUpdate) {
        return new JsonResponse(['error' => 'Élément du panier non trouvé.'], 404);
    }

    if ($quantity > 10) {
        return new JsonResponse(['error' => 'Vous avez atteint la quantité maximale pour ce produit.'], 401);
    }

    // Récupérer tous les éléments du panier de l'utilisateur
    $cartItems = $cartRepository->findBy(['user' => $itemToUpdate->getUser()]);

    // Calculer le montant total actuel du panier
    $totalAmount = 0;
    foreach ($cartItems as $cartItem) {
        if ($cartItem->getId() != $itemId) {
            $totalAmount += $cartItem->getQuantity() * $cartItem->getProduct()->getPrice();
        } else {
            $totalAmount += $quantity * $cartItem->getProduct()->getPrice();
        }
    }

    // Vérifier si le montant total dépasse 400 euros
    if ($totalAmount > 40000) {
        return new JsonResponse(['error' => 'Le montant total du panier dépasse 400 euros.'], 400);
    }

    // Mettre à jour la quantité dispo en BDD
    $product = $itemToUpdate->getProduct();
    $stock = $product->getStock();

    // Vérifier si on ajoute ou réduit la quantité du produit dans le panier
    if ($quantity > $itemToUpdate->getQuantity()) {
        $difference = $quantity - $itemToUpdate->getQuantity();
        // Retirer en BDD la différence
        $product->setStock($stock - $difference);
    } elseif ($quantity < $itemToUpdate->getQuantity()) {
        $difference = $itemToUpdate->getQuantity() - $quantity;
        // Ajouter en BDD la différence
        $product->setStock($stock + $difference);
    }

    $entityManager->persist($product);
    $entityManager->flush();

    $itemToUpdate->setQuantity($quantity);
    $entityManager->persist($itemToUpdate);
    $entityManager->flush();

    return new JsonResponse($itemToUpdate, 200);
}


    /**
 * @Route("/delete-cart", name="delete_cart", methods={"DELETE"})
 */
public function deleteCart(Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
{
    $data = json_decode($request->getContent(), true);
    // Récupérer l'utilisateur connecté (vous devrez implémenter votre propre logique d'authentification ici)
    $userId = $data['userId'];
    $user = $userRepository->find($userId);

    if (!$user) {
        return new JsonResponse(['error' => 'User not found'], 404);
    }

    $carts = $user->getCarts();

    foreach ($carts as $cart) {
        $entityManager->remove($cart);
    }

    $entityManager->flush();

    return new JsonResponse($carts, 200);
}

    /**
     * @Route("/delete-item}", name="delete_item", methods={"DELETE"})
     */
    public function deleteItem(Request $request, CartRepository $cartRepository, EntityManagerInterface $entityManager): JsonResponse
    {
    $data = json_decode($request->getContent(), true);
    $itemId = $data['itemId'];
    $itemToUpdate = $cartRepository->find($itemId);
    // Réincrémenter le stock en BDD
    $quantity = $itemToUpdate->getQuantity();
    $product = $itemToUpdate->getProduct();
    $product->setStock($product->getStock() + $quantity);
    $entityManager->persist($product);
    $entityManager->remove($itemToUpdate);
    $entityManager->flush();
    return new JsonResponse($itemToUpdate, 200);
    }
}
