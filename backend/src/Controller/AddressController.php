<?php

namespace App\Controller;

use App\Entity\Address;
use App\Repository\AddressRepository;
use App\Service\TokenService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AddressController extends AbstractController
{
    private $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    /**
     * @Route("/add-address", name="add_address", methods={"POST"})
     */
    public function addAddress(Request $request, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $houseNumber = $data['housenumber'] ?? null;
        $street = $data['street'] ?? null;
        $postcode = $data['postcode'] ?? null;
        $firstname = $data['firstname'];
        $lastname = $data['lastname'];
        $city = $data['city'] ?? null;
        $email = $data['email'] ?? null;
        $user = $userRepository->findOneBy(['email' => $email]);

        // Vérifier si l'utilisateur a déjà des adresses
        $hasAddresses = !$user->getAddress()->isEmpty();

        $address = new Address;
        // Vérifier et définir les valeurs non nulles
        if ($houseNumber !== null) {
            $address->setHousenumber($houseNumber);
        }
        if ($street !== null) {
            $address->setStreet($street);
        }
        if ($postcode !== null) {
            $address->setPostcode($postcode);
        }
        if ($city !== null) {
            $address->setCity($city);
        }
        if ($hasAddresses == false) {
            $address->setIsActive(true);
        } else {
            $address->setIsActive(false);
        }
        $address->setFirstname($firstname);
        $address->setLastname($lastname);

        $user->addAddress($address);
        $em->persist($user);
        $em->flush();

        // Retourner les données de l'adresse ajoutée
        $addressData = [
            'id' => $address->getId(),
            'housenumber' => $address->getHousenumber() ?? null,
            'street' => $address->getStreet() ?? null,
            'city' => $address->getCity() ?? null,
            'postcode' => $address->getPostcode() ?? null,
            'isActive' => $address->isIsActive(),
            'firstname' => $address->getFirstname(),
            'lastname' => $address->getLastname(),
        ];

        return new JsonResponse(['success' => true, 'data' => $addressData], 200);
    }

    /**
     * @Route("/get-address", name="get_address", methods={"GET"})
     */
    public function getAddress(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->tokenService->getUserFromRequest($request);
        if ($user instanceof JsonResponse) {
            // If $userOrResponse is a JsonResponse, there's an error
            return $user;
        }
        $user = $user;
        $addressArray = [];
        foreach ($user->getAddress() as $address) {
            $addressArray[] = [
                'id' => $address->getId(),
                'housenumber' => $address->getHouseNumber(),
                'street' => $address->getStreet(),
                'city' => $address->getCity(),
                'postcode' => $address->getPostcode(),
                'isActive' => $address->isIsActive(),
                'firstname' => $address->getFirstname(),
                'lastname' => $address->getLastname(),
            ];
        }
        return new JsonResponse($addressArray, 200);
    }

    /**
     * @Route("/change-address", name="change_address", methods={"PUT"})
     */
    public function changeAddress(AddressRepository $addressRepository, EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier que les données reçues sont bien définies
        if (!isset($data['addressId'])) {
            return new JsonResponse(['message' => 'Address ID is required'], 400);
        }

        $user = $this->tokenService->getUserFromRequest($request);

        if ($user instanceof JsonResponse) {
            // If $userOrResponse is a JsonResponse, there's an error
            return $user;
        }

        // Passer l'adresse active à inactive
        $addresses = $user->getAddress();
        foreach ($addresses as $singleAddress) {
            if ($singleAddress->isIsActive()) {
                $singleAddress->setIsActive(false);
                $em->persist($singleAddress);
            }
        }

        // Passer l'adresse cliquée sur active
        $addressToChange = $addressRepository->findOneBy([
            'id' => $data['addressId'],
        ]);

        if (!$addressToChange) {
            return new JsonResponse(['message' => 'Address not found'], 404);
        }

        $addressToChange->setIsActive(true);
        $em->persist($addressToChange);
        $em->flush();

        return new JsonResponse(['message' => 'Address changed successfully'], 200);
    }


    /**
     * @Route("/delete-address", name="delete_address", methods={"DELETE"})
     */
    public function deleteAddress(AddressRepository $addressRepository, EntityManagerInterface $em, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier que les données reçues sont bien définies
        if (!isset($data['addressId'])) {
            return new JsonResponse(['message' => 'Address ID is required'], 400);
        }

        $user = $this->tokenService->getUserFromRequest($request);

        if ($user instanceof JsonResponse) {
            // Si $user est une JsonResponse, il y a une erreur
            return $user;
        }

        // Vérifiez que l'utilisateur est bien récupéré
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        // Récupérer l'adresse à supprimer
        $addressToDelete = $addressRepository->findOneBy([
            'id' => $data['addressId'],
        ]);

        if (!$addressToDelete) {
            return new JsonResponse(['message' => 'Address not found'], 404);
        }

        // Supprimer l'adresse
        $em->remove($addressToDelete);
        $em->flush();

        // Récupérer toutes les adresses de l'utilisateur
        $userAddresses = $user->getAddress();

        // Vérifier si l'adresse supprimée était active
        if ($addressToDelete->isIsActive()) {
            // Trouver une autre adresse à passer à active
            foreach ($userAddresses as $address) {
                if (!$address->isIsActive()) {
                    $address->setIsActive(true);
                    $em->persist($address);
                    $em->flush();
                    break; // Sortir de la boucle après avoir trouvé une adresse à passer à active
                }
            }
        }

        // Retourner les adresses mises à jour
        $addressArray = [];
        foreach ($userAddresses as $address) {
            $addressArray[] = [
                'id' => $address->getId(),
                'housenumber' => $address->getHouseNumber(),
                'street' => $address->getStreet(),
                'city' => $address->getCity(),
                'postcode' => $address->getPostcode(),
                'isActive' => $address->isIsActive(),
                'firstname' => $address->getFirstname(),
                'lastname' => $address->getLastname(),
            ];
        }
        return new JsonResponse($addressArray, 200);
    }
}
