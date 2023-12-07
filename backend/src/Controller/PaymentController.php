<?php

namespace App\Controller;


use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Checkout\Session;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PaymentController extends AbstractController
{
    #[Route('/payment', name: 'app_payment')]
    public function index(): Response
    {
        return $this->render('payment/index.html.twig', [
            'controller_name' => 'PaymentController',
        ]);
    }

    /**
     * @Route("/pay", name="pay", methods={"POST"})
     */
    public function pay(Request $request): JsonResponse
{
    // définir un montant
    $amountToPay = 5000;

    // Configurez votre clé secrète Stripe
    $stripeSecretKey = $_ENV['STRIPE_SK'];
    Stripe::setApiKey($stripeSecretKey);

    // Créez une intention de paiement (PaymentIntent)
    $paymentIntent = PaymentIntent::create([
        'amount' => $amountToPay, // Montant en centimes
        'currency' => 'eur', // Devise
    ]);

    // Récupérez le clientSecret de l'intention de paiement
    $clientSecret = $paymentIntent->client_secret;

    // Envoyez le clientSecret au client (par exemple, en tant que réponse JSON)
    return new JsonResponse(['clientSecret' => $clientSecret, 'amountToPay' => $amountToPay]);
}
}
