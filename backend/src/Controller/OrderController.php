<?php

namespace App\Controller;

use DateTime;
use App\Entity\Order;
use DateTimeImmutable;
use App\Entity\OrderDetails;
use App\Entity\ActivationKey;
use App\Repository\UserRepository;
use App\Repository\OrderRepository;
use App\Service\KeyGeneratorService;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\OrderDetailsRepository;
use App\Repository\ActivationKeyRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OrderController extends AbstractController
{
    private $keyGeneratorService;

    public function __construct(KeyGeneratorService $keyGeneratorService)
    {
        $this->keyGeneratorService = $keyGeneratorService;
    }

    /**
     * @Route("/order", name="order", methods={"POST"})
     */
    public function order(Request $request, ProductRepository $productRepository, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérez le montant total depuis le corps de la requête POST
        $data = json_decode($request->getContent(), true);
        // Récupérez cartData du corps de la requête POST
        $cartData = $data['cartData'];
        $userId = $data['userId'];
        $user = $userRepository->find($userId);

        /* $date = isset($data['selectedDate']) ? new \DateTime($data['selectedDate']) : null; */

        //Créer la commande
        $order = new Order();
        $order->setUser($user);
        $order->setCreatedAt(new DateTimeImmutable());

        /* Si date existe c'est qu'on en a séléctionée une et on la persiste en BDD */
        if(isset($data['selectedDate'])) {
            $order->setDeliveryDate(new \DateTime($data['selectedDate']));
            $order->setStatus(0);
        /* Sinon on persiste la date actuelle */
        } else {
            $order->setDeliveryDate(new DateTimeImmutable());
            $order->setStatus(1);
        }

        /* Générer un numéro de commande unique*/
        $timestamp = time();
        $uniqueReference = $timestamp . uniqid();
        $order->setReference($uniqueReference);

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
            $totalPrice = $price*$quantity;

            // On bind les données à OrderDetails
            $orderDetails->setProducts($product);
            $orderDetails->setPrice($totalPrice);
            $orderDetails->setQuantity($quantity);
            $orderDetails->setPlatform($platform);

            /* On ajoute les details à la commande */
            $order->addOrderDetail($orderDetails);

            

            /* Génerer les clefs d'activation */
            for ($i = 0; $i < $quantity; $i++) {
                //Vérifier si le produit est dématerialisié avant de génerer une clé.
                if($product->isIsPhysical() == false) {
                    $activationKey = new ActivationKey();
                    $activationKey->setActivationKey($this->keyGeneratorService->generateActivationKey($platform)); // Ajoutez votre logique de génération de clé ici
                    $activationKey->setUser($user);
                    $activationKey->setOrderDetails($orderDetails);
                    $entityManager->persist($activationKey);
                }
            }
        }
        // On persiste et flush les données
        $entityManager->persist($order);
        $entityManager->flush();

        // Construire un tableau associatif avec les informations sur la commande et les détails de commande
        $orderData = [
            'order' => [
                'id' => $order->getId(),
                'reference' => $order->getReference(),
                // ... autres champs
            ],
            'orderDetails' => [],
        ];

        // Ajouter les informations sur les détails de commande au tableau
        foreach ($order->getOrderDetails() as $orderDetail) {
            $orderData['orderDetails'][] = [
                'id' => $orderDetail->getId(),
                'quantity' => $orderDetail->getQuantity(),
                // ... autres champs
            ];
        }

        return new JsonResponse($orderData, 200);
    }

/**
 * @Route("/get-order/{id}", name="get_order", methods={"GET"})
 */
public function getOrder(Request $request, $id, UserRepository $userRepository, 
OrderRepository $orderRepository, OrderDetailsRepository $orderDetailsRepository, 
ActivationKeyRepository $activationKeyRepository): JsonResponse 
{
    // Récupérer l'utilisateur
    $user = $userRepository->find($id);

    // Vérifier si l'utilisateur existe
    if (!$user) {
        return new JsonResponse(['error' => 'Utilisateur non trouvé.'], 404);
    }

    // Récupérer la commande associée à l'utilisateur
    $order = $orderRepository->findOneBy(['user' => $user]);

    // Vérifier si une commande a été trouvée
    if (!$order) {
        return new JsonResponse(['error' => 'Aucune commande trouvée pour cet utilisateur.'], 404);
    }

    // Récupérer les détails de la commande associée à la commande
    $orderDetails = $orderDetailsRepository->findAll(['order' => $order]);

    // Vérifier si des détails de commande on été trouvés.
    if (!$orderDetails) {
        return new JsonResponse(['error' => 'Aucune commande trouvée pour cet utilisateur.'], 404);
    }

    //RECUPERER LES CHAMPS ASSOCIES, SINON CELA RENVOIE UN OBJET VIDE
    $userArray = [
       'firstname' => $user->getFirstname(),
       'lastname' => $user->getLastname(),
    ];

    foreach($orderDetails as $orderDetail) {
        $orderDetailArray[] = [
            'platform' => $orderDetail->getPlatform(),
            'price'=> $orderDetail->getPrice(),
            'quantity'=> $orderDetail->getQuantity(),
            'id' => $orderDetail->getId(),
            'img'=> $orderDetail->getProducts()->getImg(),
            'name'=> $orderDetail->getProducts()->getName(),
        ];
    }

    $orderArray = [
        'reference' => $order->getReference(),
        'date' => $order->getCreatedAt(),
    ];

    $keys = $activationKeyRepository->findAll(['orderDetails' => $orderDetails]);

    foreach($keys as $key) {
        $keyArray[] = [
            'activation_key' => $key->getActivationKey(),
            'orderId' => $key->getOrderDetails()->getId(),
        ];
    }

    return new JsonResponse([$userArray, $orderArray, $orderDetailArray, $keyArray], 200);
}
}
