<?php

namespace App\Controller;

use App\Service\EmailService;
use App\Service\TokenService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ParametersController extends AbstractController
{

    private $emailService;
    private $tokenService;

    public function __construct(TokenService $tokenService, EmailService $emailService)
    {
        $this->tokenService = $tokenService;
        $this->emailService = $emailService;
    }

    /**
     * @Route("/change-mail", name="change_mail", methods={"POST"})
     */
    public function changeMail(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->tokenService->getUserFromRequest($request);
        $email = $data['mail'];

        //Vérifier si l'utilisateur existe en BDD
        $userInDb = $userRepository->findOneBy(['email' => $email]);
        if ($userInDb) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        //Vérifier si le mail à update existe déja en BDD
        $newMailInDb = $userRepository->findOneBy(['mailToUpdate' => $email]);
        if ($newMailInDb) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $password = $data['password'];
        if ($user && $passwordHasher->isPasswordValid($user, $password)) {
            /* Créer un token */
            $randomString = bin2hex(random_bytes(16));
            $timestamp = time();
            $expirationTimestamp = $timestamp + 86400;
            $dateTime = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
            $dateTime->setTimestamp($expirationTimestamp);
            $token = $randomString . $timestamp;
            $user->setTokenMail($token);
            $user->setMailExpiration($dateTime);
            $user->setMailToUpdate($email);
            $em->persist($user);
            $em->flush();

            $mail = $user->getEmail();

            $this->emailService->sendWithTemplate(
                'pishagaming.noreply@gmail.com',
                $mail,
                'Changement de votre adresse mail',
                'emails/changemail.html.twig',
                [
                    'token' => $user->getTokenMail(),
                ]
            );
        }

        return new JsonResponse(['message' => 'un mail d\'activation a été envoyé à votre adresse'], 200);
    }

    /**
     * @Route("/check-mail", name="check_mail", methods={"POST"})
     */
    public function checkMail(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'];
        $user = $userRepository->findOneBy(['tokenMail' => $token]);
        $email = $user->getMailToUpdate();

        $now = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
        $expirationDate = new \DateTime($user->getMailExpiration()->format('Y-m-d H:i:s'), new \DateTimeZone('Europe/Paris'));

        if ($expirationDate > $now) {
            $user->setEmail($email);
            $user->setMailExpiration(null);
            $user->setTokenMail(null);
            $user->setMailToUpdate(null);
            $em->persist($user);
            $em->flush();
        } else {
            // Le token n'est pas valide
            $user->setTokenMail(null);
            $user->setMailExpiration(null);
            $user->setMailToUpdate(null);
            $em->persist($user);
            $em->flush();
            return new JsonResponse(['error' => 'Votre lien a expiré. Vous pouvez effectuer une nouvelle demande.', JsonResponse::HTTP_BAD_REQUEST]);
        }
        return new JsonResponse(['message' => 'Votre adresse mail a bien été changé. Veuillez vous reconnecter avec la nouvelle.']);
    }

    /**
     * @Route("/change-password", name="change_password", methods={"POST"})
     */
    public function changePassword(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $password = $data['password'];
        $newPassword = $data['newPassword'];
        $user = $this->tokenService->getUserFromRequest($request);

        if ($user && $passwordHasher->isPasswordValid($user, $password)) {
            $user->setPassword($passwordHasher->hashPassword($user, $newPassword));
            $em->persist($user);
            $em->flush();
            return new JsonResponse(['message' => 'Votre mot de passe a bien été changé.
            Vous pourrez l\'utiliser lors de votre prochaine connexion.']);
        } else {
            return new JsonResponse(['error' => 'une erreur est survenue']);
        }
    }

    /**
     * @Route("/change-pseudo", name="change_pseudo", methods={"POST"})
     */
    public function changePseudo(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $pseudo = $data['pseudo'];
        $user = $this->tokenService->getUserFromRequest($request);
        if ($user) {
            $user->setPseudo($pseudo);
            $em->persist($user);
            $em->flush();
            // Renvoyer les nouvelles informations de l'utilisateur
            return new JsonResponse(['message' => 'Pseudo changé']);
        } else {
            return new JsonResponse(['error' => 'une erreur est survenue'], 400);
        }
    }


    /**
     * @Route("/get-user-data", name="get_user_data", methods={"GET"})
     */
    public function getUserData(Request $request, TokenService $tokenService)
    {
        $user = $tokenService->getUserFromRequest($request);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        // Retournez les données de l'utilisateur sous forme de tableau
        return $this->json([
            'createdAt' => $user->getCreatedAt(),
            'pseudo' => $user->getPseudo(),
            'img' => $user->getImg(),
            'createdAt' => $user->getCreatedAt(),
        ]);
    }

    /**
     * @Route("/upload-user-image", name="upload_user_image", methods={"POST"})
     */
    public function uploadImage(Request $request, EntityManagerInterface $entityManager): Response
    {
        $file = $request->files->get('img');

        if ($file instanceof UploadedFile) {
            // Générer un nom de fichier unique sans le nom original
            $newFilename = uniqid() . '.' . $file->guessExtension();

            // Recadrer et redimensionner l'image
            $resizedImagePath = $this->cropAndResizeImage($file->getPathname(), 150, 150);

            try {
                // Déplacer l'image redimensionnée vers le répertoire de destination
                $destinationPath = $this->getParameter('images_directory') . '/' . $newFilename;
                copy($resizedImagePath, $destinationPath);
                unlink($resizedImagePath); // Supprimer l'image temporaire
            } catch (FileException $e) {
                return new Response('Erreur lors de l\'upload du fichier.', Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            // Récupérer l'utilisateur actuellement authentifié
            $user = $this->tokenService->getUserFromRequest($request);

            if (!$user) {
                return new Response('Utilisateur non authentifié.', Response::HTTP_UNAUTHORIZED);
            }

            // Supprimer l'ancienne image si elle existe
            $oldImagePath = $this->getParameter('images_directory') . '/' . $user->getImg();
            if (file_exists($oldImagePath) && is_file($oldImagePath)) {
                unlink($oldImagePath);
            }

            // Enregistrez le nom du fichier dans la base de données si nécessaire
            $user->setImg($newFilename);
            $entityManager->persist($user);
            $entityManager->flush();

            return new Response('Fichier uploadé avec succès.', Response::HTTP_OK);
        }

        return new Response('Aucun fichier uploadé.', Response::HTTP_BAD_REQUEST);
    }




    private function cropAndResizeImage($imagePath, $width, $height)
    {
        list($originalWidth, $originalHeight, $type) = getimagesize($imagePath);

        switch ($type) {
            case IMAGETYPE_JPEG:
                $image = imagecreatefromjpeg($imagePath);
                break;
            case IMAGETYPE_PNG:
                $image = imagecreatefrompng($imagePath);
                break;
            case IMAGETYPE_GIF:
                $image = imagecreatefromgif($imagePath);
                break;
            default:
                throw new \Exception('Type de fichier non supporté.');
        }

        // Calculer les dimensions de recadrage
        $cropSize = min($originalWidth, $originalHeight);
        $cropX = ($originalWidth - $cropSize) / 2;
        $cropY = ($originalHeight - $cropSize) / 2;

        // Créer une image carrée recadrée
        $croppedImage = imagecreatetruecolor($cropSize, $cropSize);
        imagecopy($croppedImage, $image, 0, 0, $cropX, $cropY, $cropSize, $cropSize);

        // Redimensionner l'image recadrée
        $resizedImage = imagecreatetruecolor($width, $height);
        imagecopyresampled($resizedImage, $croppedImage, 0, 0, 0, 0, $width, $height, $cropSize, $cropSize);

        $tempFilePath = tempnam(sys_get_temp_dir(), 'resized_image');
        switch ($type) {
            case IMAGETYPE_JPEG:
                imagejpeg($resizedImage, $tempFilePath);
                break;
            case IMAGETYPE_PNG:
                imagepng($resizedImage, $tempFilePath);
                break;
            case IMAGETYPE_GIF:
                imagegif($resizedImage, $tempFilePath);
                break;
        }

        imagedestroy($image);
        imagedestroy($croppedImage);
        imagedestroy($resizedImage);

        return $tempFilePath;
    }
}
