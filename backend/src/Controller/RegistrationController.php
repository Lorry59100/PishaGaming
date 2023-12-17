<?php

namespace App\Controller;
use DateTimeZone;
use App\Entity\User;
use App\Service\CartService;
use App\Service\EmailService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{
    private $cartService;
    private $emailService;

    public function __construct(CartService $cartService, EmailService $emailService)
    {
        $this->cartService = $cartService;
        $this->emailService = $emailService;
    }

    /**
     * @Route("/register", name="register", methods={"POST"})
     */
    public function register(Request $request, EntityManagerInterface $em, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse
    { 
        $data = json_decode($request->getContent(), true);
        /* Vérifier si l'utilisateur existe déja en BDD */
        $email = $data['email'];
        $userInDb = $userRepository->findOneBy(['email' => $email]);
        if($userInDb) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $cart = $data['cart'] ?? []; // Retrieve the cart information

        $birthDateStr = $data['birthDate'];
        // Créer un objet DateTime à partir de la chaîne (en supposant le fuseau horaire UTC)
        $dateBirthday = new \DateTime($birthDateStr, new \DateTimeZone('UTC'));
        // Convertir le fuseau horaire en Europe/Paris (ou le fuseau horaire que vous souhaitez utiliser)
        $dateBirthday->setTimezone(new DateTimeZone('Europe/Paris'));

        /* Vérifier si l'utilisateur a bien 16 ans ou + */
        $currentDate = new \DateTime();
        $age = $currentDate->diff($dateBirthday)->y;

        if ($age < 16) {
            return new JsonResponse(['error' => 'Vous devez avoir au moins 16 ans pour vous inscrire'], JsonResponse::HTTP_BAD_REQUEST);
        }

        /* Créer un token */
        $randomString = bin2hex(random_bytes(16));
        $timestamp = time();
        $expirationTimestamp = $timestamp + 24 * 60 * 60;
        $dateTime = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
        $dateTime->setTimestamp($expirationTimestamp);
        $token = $randomString . $timestamp;
        // Obtenir les 5 premiers chiffres du timestamp
        $timestampPrefix = substr($timestamp, 0, 5);
        $pseudo = 'gamer-' . $timestampPrefix;
        
        $user = new User();
        $user->setEmail($data['email'])
            ->setFirstname($data['firstname'])
            ->setLastname($data['lastname'])
            ->setBirthdate($dateBirthday)
            ->setPassword($passwordHasher->hashPassword($user, $data['password']))
            ->setToken($token)
            ->setTokenexpiration($dateTime)
            ->setIsVerified(false)
            ->setPseudo($pseudo)
            ->setRoles(['ROLE_USER']);
        $em->persist($user);
        $em->flush();

        if ($cart) {
        $this->cartService->createCartEntities($user, $cart, $em);
        }

        $this->emailService->sendWithTemplate(
            'pishagaming.noreply@gmail.com',
            $user->getEmail(),
            'Activation de votre compte Pisha Gaming',
            'emails/signup.html.twig',
            [
                'token' => $user->getToken(),
            ]
        );
        
            return new JsonResponse(['message' => 'Un mail vous a été envoyé pour valider votre compte. Pensez à vérifier vos spams']);
    }

    /**
     * @Route("/account-activation", name="account_activation", methods={"POST"})
     */
    public function accountActivation(Request $request, UserRepository $userRepository,EntityManagerInterface $em): JsonResponse
    { 
        $data = json_decode($request->getContent(), true);
        $token = $data['token'];
        $user = $userRepository->findOneBy(['token' => $token]);
        $now = new \DateTime();
        $expirationDate = $user->getTokenExpiration();

        if ($expirationDate > $now) {
            // Le token est valide
            $user->setIsVerified(true);
            $user->setToken(null);
            $user->setTokenexpiration(null);
            $em->persist($user);
            $em->flush();
        } else {
            // Le token n'est pas valide
            return new JsonResponse(['error' => 'Votre lien a expiré vous pouvez effectuer une nouvelle demande en cliquant ici']);
        }
        
        
        return new JsonResponse(['message' => 'Votre compte a été validé félicitations !']);
    }
}
