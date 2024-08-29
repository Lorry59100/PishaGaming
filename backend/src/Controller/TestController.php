<?php

namespace App\Controller;

use App\Entity\Test;
use App\Entity\Point;
use App\Repository\ProductRepository;
use App\Service\TokenService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TestController extends AbstractController
{
    private $tokenService;
    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }


    /**
     * @Route("/submit-test", name="submit_test", methods={"POST"})
     */
    public function submitTest(Request $request, ProductRepository $productRepository, EntityManagerInterface $em): JsonResponse
    {
        // Récupérer les données
        $data = json_decode($request->getContent(), true);

        $productId = $data['productId'];
        $rating = $data['rating'];
        $description = $data['description'];
        $pros = $data['pros'];
        $cons = $data['cons'];

        // Récupérer le produit en BDD
        $product = $productRepository->find($productId);
        
        // Récupérer l'utilisateur
        $user = $this->tokenService->getUserFromRequest($request);

        $test = new Test();
        $test->setRate($rating);
        $test->setComment($description);
        $test->setCreatedAt(new \DateTimeImmutable());
        $test->setProduct($product);
        $test->setUser($user);

        foreach ($pros as $pro) {
            if (!empty(trim($pro))) { // trim supprime les espaces avant et après la chaine de caractères.
                $point = new Point();
                $point->setDescription($pro);
                $point->setIsPositive(true);
                $point->setTest($test);
                $test->addPoint($point);
            }
        }

        foreach ($cons as $con) {
            if (!empty(trim($con))) {
                $point = new Point();
                $point->setDescription($con);
                $point->setIsPositive(false);
                $point->setTest($test);
                $test->addPoint($point);
            }
        }

        $em->persist($test);
        $em->flush();

        return new JsonResponse('kikoo', 200);
    }
}
