<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderDetails;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OrderController extends AbstractController
{
    /**
     * @Route("/order", name="order", methods={"POST"})
     */
    public function order(Request $request, ProductRepository $productRepository, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérez le montant total depuis le corps de la requête POST
        $data = json_decode($request->getContent(), true);
        /* dd($data); */
        // Récupérez cartData du corps de la requête POST
        $cartData = $data['cartData'];
        $userId = $data['userId'];
        $user = $userRepository->find($userId);

        //Créer la commande
        $order = new Order();
        $order->setUser($user);
        $order->setCreatedAt(new DateTimeImmutable());

        /* Changer le hash */
        $order->setReference(uniqid());

        // Boucler sur le panier
        foreach($cartData as $item) {
            // Créer les détails de commande
            $orderDetails = new OrderDetails();

            //On récupère le produit en BDD
            $productId = $item['productId'];
            $product = $productRepository->find($productId);

            $platform = $item['platform'];
            $price = $item['price'];
            $quantity = $item['quantity'];

            // On bind les données à OrderDetails
            $orderDetails->setProducts($product);
            $orderDetails->setPrice($price);
            $orderDetails->setQuantity($quantity);
            $orderDetails->setPlatform($platform);

            /* On ajoute les details à la commande */
            $order->addOrderDetail($orderDetails);
        }

        // On persiste et flush les données
        $entityManager->persist($order);
        $entityManager->flush();
        
    }
}
