<?php

namespace App\Controller;

use App\Entity\Address;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class AddressController extends AbstractController
{
    /**
     * @Route("/add-address", name="add_address", methods={"POST"})
     */
    public function addAddress(Request $request, UserRepository $userRepository, EntityManagerInterface $em) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $houseNumber = $data['housenumber'];
        $street = $data['street'];
        $postcode = $data['postcode'];
        $city = $data['city'];
        $email = $data['email'];
        $user = $userRepository->findOneBy(['email' => $email]);

        $address = new Address;
        $address->setHousenumber($houseNumber);
        $address->setStreet($street);
        $address->setPostcode($postcode);
        $address->setCity($city);

        $user->addAddress($address);
        $em->persist($user);
        $em->flush();

        return new JsonResponse(['success' => true, 'data' => $data], 200);
    }

    /**
     * @Route("/get-address", name="get_address", methods={"GET"})
     */
    public function getAddress(Request $request, UserRepository $userRepository) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        // Récupérez les en-têtes de la requête
        $headers = $request->headers;
        dd($headers);
        return new JsonResponse(['success' => true, 'data' => $data], 200);
        
    }
}
