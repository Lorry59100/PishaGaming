<?php

namespace App\Controller;

use App\Entity\Address;
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
    public function getAddress(Request $request) : JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->tokenService->getUserFromRequest($request);
        if ($user instanceof JsonResponse) {
            // If $userOrResponse is a JsonResponse, there's an error
            return $user;
        }
    $user = $user;
    $addressArray = [];
    foreach($user->getAddress() as $address) {
        $addressArray[] = [
            'id' => $address->getId(),
            'housenumber' => $address->getHouseNumber(),
            'street' => $address->getStreet(),
            'city' => $address->getCity(),
            'postcode' => $address->getPostcode(),
        ];
    }
        return new JsonResponse($addressArray, 200);
    }
}
