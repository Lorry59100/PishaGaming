<?php

namespace App\Controller;

use DateTimeZone;
use App\Entity\Order;
use App\Entity\OrderDetails;
use App\Entity\ActivationKey;
use App\Service\TokenService;
use App\Repository\UserRepository;
use App\Repository\OrderRepository;
use App\Service\KeyGeneratorService;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\OrderDetailsRepository;
use App\Repository\ActivationKeyRepository;
use App\Repository\PlatformRepository;
use App\Service\EmailService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class OrderController extends AbstractController
{
    private $keyGeneratorService;
    private $tokenService;
    private $emailService;

    public function __construct(KeyGeneratorService $keyGeneratorService, TokenService $tokenService, EmailService $emailService)
    {
        $this->keyGeneratorService = $keyGeneratorService;
        $this->tokenService = $tokenService;
        $this->emailService = $emailService;
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
    $address = $data['orderData']['addressInfo']['address'];
    $firstname = $data['orderData']['addressInfo']['firstname'];
    $lastname = $data['orderData']['addressInfo']['lastname'];

    /* $date = isset($data['selectedDate']) ? new \DateTime($data['selectedDate']) : null; */

    //Créer la commande
    $order = new Order();
    $order->setUser($user);
    $currentDate = new \DateTimeImmutable('now', new \DateTimeZone('UTC'));
    $currentDate = $currentDate->setTimezone(new \DateTimeZone('Europe/Paris'));
    $order->setCreatedAt($currentDate);

    /* Si date existe c'est qu'on en a séléctionée une et on la persiste en BDD */
    if(isset($data['selectedDate'])) {
        $deliveryDateStr = $data['selectedDate'];
        $deliveryDate = new \DateTime($deliveryDateStr, new \DateTimeZone('UTC'));
        $deliveryDate->setTimezone(new DateTimeZone('Europe/Paris'));
        $order->setDeliveryDate($deliveryDate);
        $order->setStatus(0);
    /* Sinon on persiste la date actuelle */
    } else {
        $order->setDeliveryDate($currentDate);
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
        $category = $item['category'];
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

        // Définir les plateformes prises en charge
        $supportedPlatforms = [
            "PlayStation 5",
            "PlayStation 4",
            "PC",
            "iOS",
            "macOS",
            "Linux",
            "Nintendo Switch",
            "Classic Macintosh",
            "Apple II",
            "Xbox Series X",
            "Xbox One",
            "Xbox Series SX",
        ];

        /* Génerer les clefs d'activation */
        for ($i = 0; $i < $quantity; $i++) {
            // Vérifier que le produit est bien un JV
            if($category === "Jeux Vidéos") {
                //Vérifier si le produit est dématerialisié avant de génerer une clé.
                if(in_array($platform, $supportedPlatforms)) {
                    $activationKey = new ActivationKey();
                    $activationKey->setActivationKey($this->keyGeneratorService->generateActivationKey($platform)); // Ajoutez votre logique de génération de clé ici
                    $activationKey->setUser($user);
                    $activationKey->setOrderDetails($orderDetails);
                    $entityManager->persist($activationKey);
                }
            }
        }
    }
    // Calculer le prix total de la commande
    $totalOrderPrice = 0;
    foreach ($order->getOrderDetails() as $orderDetail) {
        $totalOrderPrice += $orderDetail->getPrice();
    }
    $order->setTotalPrice($totalOrderPrice);
    $order->setDeliveryAddress($address);
    $order->setDeliveryFirstname($firstname);
    $order->setDeliveryLastname($lastname);

    // On persiste et flush les données
    $entityManager->persist($order);
    $entityManager->flush();

    // Construire un tableau associatif avec les informations sur la commande et les détails de commande
    $orderData = [
        'order' => [
            'id' => $order->getId(),
            'reference' => $order->getReference(),
            'totalPrice' => $order->getTotalPrice(),
            'createdAt' => $order->getCreatedAt(),
            'deliveryDate' => $order->getDeliveryDate(),
            'status' => $order->getStatus(),
            'deliveryAddress' => $order->getDeliveryAddress(),
            'deliveryFirstname' => $order->getDeliveryFirstname(),
            'deliveryLastname' => $order->getDeliveryLastname(),
        ],
        'orderDetails' => [],
    ];

    // Ajouter les informations sur les détails de commande au tableau
    foreach ($order->getOrderDetails() as $orderDetail) {
        $imagePath = 'uploads/images/products/videogames/main_img/' . $orderDetail->getProducts()->getImg();
        $orderData['orderDetails'][] = [
            'id' => $orderDetail->getId(),
            'quantity' => $orderDetail->getQuantity(),
            'price' => $orderDetail->getPrice(),
            'platform' => $orderDetail->getPlatform(),
            'product' => $orderDetail->getProducts()->getName(), // Assurez-vous que le produit a une méthode getName()
            'imagePath' => $imagePath, // Ajoutez le chemin complet de l'image
        ];
    }

    $this->emailService->sendWithTemplate(
        'pishagaming.noreply@gmail.com',
        $user->getEmail(),
        'Récapitulatif de votre commande n°: ' . $uniqueReference,
        'emails/bill.html.twig',
        [
            'order' => $orderData['order'],
            'orderDetails' => $orderData['orderDetails'],
        ]
    );

    return new JsonResponse($orderData, 200);
}



/**
 * @Route("/get-order/{id}", name="get_order", methods={"GET"})
 */
public function getOrder(Request $request, $id, UserRepository $userRepository,
OrderRepository $orderRepository, OrderDetailsRepository $orderDetailsRepository,
ActivationKeyRepository $activationKeyRepository, PlatformRepository $platformRepository): JsonResponse
{
    // Récupérer l'utilisateur
    $user = $userRepository->find($id);

    // Vérifier si l'utilisateur existe
    if (!$user) {
        return new JsonResponse(['error' => 'Utilisateur non trouvé.'], 404);
    }

    // Récupérer la commande associée à l'utilisateur
    $order = $orderRepository->findOneBy(['user' => $user], ['created_at' => 'DESC']);

    // Vérifier si une commande a été trouvée
    if (!$order) {
        return new JsonResponse(['error' => 'Aucune commande trouvée pour cet utilisateur.'], 404);
    }

    // Récupérer les détails de la commande associée à la commande
    $orderDetails = $order->getOrderDetails();

    // Vérifier si des détails de commande ont été trouvés.
    if (!$orderDetails) {
        return new JsonResponse(['error' => 'Aucune commande trouvée pour cet utilisateur.'], 404);
    }

    $orderDetailArray = [];
    foreach($orderDetails as $orderDetail) {
        $platform = $platformRepository->findOneBy(['name' => $orderDetail->getPlatform()]);
        $orderDetailArray[] = [
            'platform' => $orderDetail->getPlatform(),
            'price'=> $orderDetail->getPrice(),
            'quantity'=> $orderDetail->getQuantity(),
            'id' => $orderDetail->getId(),
            'img'=> $orderDetail->getProducts()->getImg(),
            'name'=> $orderDetail->getProducts()->getName(),
            'isPhysical' => $platform->isIsPhysical(),
        ];
    }

    $orderArray = [
        'reference' => $order->getReference(),
        'date' => $order->getCreatedAt(),
        'deliveryDate'=> $order->getDeliveryDate(),
    ];

    // Initialiser $keyArray
    $keyArray = [];

    // Récupérer les clés d'activation pour chaque détail de commande
    foreach ($orderDetails as $orderDetail) {
        $keys = $activationKeyRepository->findBy(['orderDetails' => $orderDetail]);
        foreach ($keys as $key) {
            $keyArray[] = [
                'activation_key' => $key->getActivationKey(),
                'orderId' => $key->getOrderDetails()->getId(),
            ];
        }
    }

    return new JsonResponse([$orderArray, $orderDetailArray, $keyArray], 200);
}



    /**
     * @Route("/order-historic", name="order_historic", methods={"GET"})
     */
    public function orderHistoric(Request $request): JsonResponse
    {
        $user = $this->tokenService->getUserFromRequest($request);
        $ordersArray = [];

        foreach ($user->getOrders() as $order) {
            $orderDetailsArray = [];
            $orderTotal = 0;
            foreach ($order->getOrderDetails() as $orderDetail) {
                $orderDetailsArray[] = [
                    'id' => $orderDetail->getId(),
                    'product' => $orderDetail->getProducts()->getName(),
                    'img' => $orderDetail->getProducts()->getImg(),
                    'quantity' => $orderDetail->getQuantity(),
                    'platform' => $orderDetail->getPlatform(),
                    'price' => $orderDetail->getPrice(),
                ];
                $orderTotal += $orderDetail->getPrice();
            }
                $ordersArray[] = [
                    'id' => $order->getId(),
                    'reference' => $order->getReference(),
                    'created_at' => $order->getCreatedAt(),
                    'delivery_date' => $order->getDeliveryDate(),
                    'status' => $order->getStatus(),
                    'order_details' => $orderDetailsArray,
                    'total' => $orderTotal,
                ];
        }
        return new JsonResponse($ordersArray, 200);
    }

     /**
     * @Route("/single-order-historic/{reference}", name="single_order_historic", methods={"GET"})
     */
    public function singleOrderHistoric(Request $request, $reference, OrderRepository $orderRepository): JsonResponse
    {
        $orders = $orderRepository->findOneBy(['reference' => $reference]);

    $orderArray[] = [
        'id' => $orders->getId(),
        'date' => $orders->getCreatedAt(),
        'status' => $orders->getStatus(),
        'reference' => $orders->getReference(),
    ];

    $orderDetailsArray = [];

    foreach ($orders->getOrderDetails() as $order) {
        $activationKeys = [];

        foreach ($order->getActivationKeys() as $activationKey) {
            $activationKeys[] = [
                'activationKeyId' => $activationKey->getId(),
                'activation' => $activationKey->getActivationKey(),
            ];
        }

        $orderDetailsArray[] = [
            'id' => $order->getId(),
            'quantity' => $order->getQuantity(),
            'product' => $order->getProducts()->getName(),
            'img' => $order->getProducts()->getImg(),
            'platform' => $order->getPlatform(),
            'price' => $order->getPrice(),
            'delivery' => $orders->getDeliveryDate(),
            'activationKeys' => $activationKeys,
        ];
    }
        return new JsonResponse([$orderDetailsArray, $orderArray], 200);
    }
}
