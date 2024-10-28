<?php

namespace App\Controller;

use App\Entity\Wishlist;
use App\Repository\CartRepository;
use App\Service\TokenService;
use App\Repository\UserRepository;
use App\Repository\ProductRepository;
use App\Repository\WishlistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class WishlistController extends AbstractController
{

    private $tokenService;
    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    /**
     * @Route("/add-to-wishlist/{id}", name="add_to_wishlist", methods={"POST"})
     */
    public function addToWishlist(Request $request, $id, ProductRepository $productRepository, UserRepository $userRepository,
    WishlistRepository $wishlistRepository, EntityManagerInterface $entityManager) {
        $data = json_decode($request->getContent(), true);
        
        //Récuperer le produit
        $product = $productRepository->find($id);

        // Récupérer l'utilisateur connecté
        $userId = $data['userId'];
        $user = $userRepository->find($userId);

        $existingWishlistItem = $wishlistRepository->findOneBy([
            'user' => $user,
            'product' => $product,
        ]);

        if($existingWishlistItem) {
            // Plutot retirer le produit de la wishlist
            $entityManager->remove($existingWishlistItem);
            $entityManager->flush();
            return new JsonResponse(['success' => true, 'message' => 'Product removed from wislist.']);
        } else {
            // Si l'élément n'existe pas, créez une nouvelle entité Wishlist
            $wishlistItem = new Wishlist();
            $wishlistItem->setProduct($product);
            $wishlistItem->setUser($user);
            $entityManager->persist($wishlistItem);
            $entityManager->flush();
            return new JsonResponse(['success' => true, 'message' => 'Product added to wislist.']);
        }
    }

    /**
     * @Route("/get-wishlist", name="get_wishlist", methods={"GET"})
     */
    public function getWishlist(Request $request) {
        // Récupérer l'utilisateur
        $user = $this->tokenService->getUserFromRequest($request);

        $wishlists = $user->getWishlists();

        $wishlistArray = [];
        foreach ($wishlists as $wishlist) {
            $wishlistArray[] = [
                'id' => $wishlist->getId(),
                'product' => [
                    'id' => $wishlist->getProduct()->getId(),
                    'name' => $wishlist->getProduct()->getName(),
                    'img' => $wishlist->getProduct()->getImg(),
                    'old_price' => $wishlist->getProduct()->getOldPrice(),
                    'price' => $wishlist->getProduct()->getPrice(),
                ],
            ];
        }
        return new JsonResponse($wishlistArray);
    }

    /**
     * @Route("/move-to-wishlist/{id}", name="move_to_wishlist", methods={"POST"})
     */
    public function moveToWishlist(Request $request, $id, ProductRepository $productRepository, WishlistRepository $wishlistRepository ,
    UserRepository $userRepository, CartRepository $cartRepository ,EntityManagerInterface $entityManager) {
        $data = json_decode($request->getContent(), true);
        //get user
        $userId = $data['userId'];
        $user = $userRepository->find($userId);
        //get product
        $product = $productRepository->find($id);
        //get wishlist
        $existingWishlistItem = $wishlistRepository->findOneBy([
            'user' => $user,
            'product' => $product,
        ]);
        //check if already in wishlist
        if(!$existingWishlistItem) {
            $wishlistItem = new Wishlist();
            $wishlistItem->setProduct($product);
            $wishlistItem->setUser($user);
            $entityManager->persist($wishlistItem);
            $entityManager->flush();
        } 
        //remove item from cart
        $itemToUpdate= $cartRepository->findOneBy([
            'user' => $user,
            'product' => $product,
        ]);
        $entityManager->remove($itemToUpdate);
        $entityManager->flush();
        //response
        return new JsonResponse(['success' => true, 'message' => 'Product moved to wislist.']);
    }
}
