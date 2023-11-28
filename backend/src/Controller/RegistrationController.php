<?php

namespace App\Controller;
use DateTimeZone;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{
    
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
            return new JsonResponse(['Cette adresse mail est déjà prise', 201]);
        }

        $birthDateStr = $data['birthDate'];
        // Créer un objet DateTime à partir de la chaîne (en supposant le fuseau horaire UTC)
        $dateBirthday = new \DateTime($birthDateStr, new \DateTimeZone('UTC'));
        // Convertir le fuseau horaire en Europe/Paris (ou le fuseau horaire que vous souhaitez utiliser)
        $dateBirthday->setTimezone(new DateTimeZone('Europe/Paris'));

        /* Vérifier si l'utilisateur a bien 16 ans ou + */
        $currentDate = new \DateTime();
        $age = $currentDate->diff($dateBirthday)->y;

        if ($age < 16) {
            return new JsonResponse(['message' => 'Vous devez avoir au moins 16 ans pour vous inscrire'], 201);
        }
        $user = new User();
        $user->setEmail($data['email'])
            ->setFirstname($data['firstname'])
            ->setLastname($data['lastname'])
            ->setBirthdate($dateBirthday)
            ->setPassword($passwordHasher->hashPassword($user, $data['password']))
            ->setRoles(['ROLE_USER']);
        $em->persist($user);
        $em->flush();
        /* Créer un token et l'envoyer à l'adresse mail */
        
            return new JsonResponse(['message' => 'Un mail vous a été envoyé pour valider votre adresse mail']);
    }
}
