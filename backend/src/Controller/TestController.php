<?php

namespace App\Controller;

use App\Entity\Test;
use App\Entity\Point;
use App\Repository\PointRepository;
use App\Repository\ProductRepository;
use App\Repository\TestRepository;
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
     * @Route("/user-tests", name="user_tests", methods={"GET"})
     */
    public function userTests(Request $request, TestRepository $testRepository, EntityManagerInterface $em): JsonResponse
    {
        // Récupérer les données
        $data = json_decode($request->getContent(), true);

        // Récupérer l'utilisateur
        $user = $this->tokenService->getUserFromRequest($request);

        $tests = $user->getTests();
        $testsArray = [];
        foreach ($tests as $test) {
            $testsArray[] = [
                'id' => $test->getId(),
                'productId' => $test->getProduct()->getid(),
                'img' => $test->getProduct()->getImg(),
                'comment' => $test->getComment(),
                'rate' => $test->getRate(),
            ];
        };

        return new JsonResponse($testsArray, 200);
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

    /**
     * @Route("/get-test/{id}", name="get_test", methods={"GET"})
     */
    public function getTest(Request $request, ProductRepository $productRepository, TestRepository $testRepository, PointRepository $pointRepository, EntityManagerInterface $em, $id): JsonResponse
    {
        // Récupérer l'utilisateur
        $user = $this->tokenService->getUserFromRequest($request);

        // Récupérer le produit en BDD
        $product = $productRepository->find($id);

        // Récupérer le test correspondant à l'utilisateur et au produit
        $test = $testRepository->findOneBy(['user' => $user, 'product' => $product]);

        $points = $test->getPoints();
        $positivePoints = [];
        $negativePoints = [];

        foreach ($points as $point) {
            if ($point->isIsPositive() === true) {
                $positivePoints[] = $point->getDescription();
            } elseif ($point->isIsPositive() === false) {
                $negativePoints[] = $point->getDescription();
            }
        }

        // Retourner les données du test sous forme de réponse JSON
    return new JsonResponse([
        'rate' => $test->getRate(),
        'comment' => $test->getComment(),
        'positivePoints' => $positivePoints,
        'negativePoints' => $negativePoints,
    ]);
    }

    /**
     * @Route("/update-test/{id}", name="update_test", methods={"PUT"})
     */
    public function updateTest(Request $request, TestRepository $testRepository, PointRepository $pointRepository, ProductRepository $productRepository, EntityManagerInterface $em, $id): JsonResponse
    {
        // Récupérer les données envoyées par le frontend
        $data = json_decode($request->getContent(), true);

        // Récupérer l'utilisateur
        $user = $this->tokenService->getUserFromRequest($request);

        // Récupérer le produit en BDD
        $product = $productRepository->find($id);

        // Récupérer le test correspondant à l'utilisateur et au produit
        $test = $testRepository->findOneBy(['user' => $user, 'product' => $product]);

        if (!$test) {
            return new JsonResponse(['error' => 'Test not found'], 404);
        }

        // Mettre à jour les champs du test
        $test->setRate($data['rating']);
        $test->setComment($data['description']);

        // Mettre à jour les points positifs et négatifs
        $this->updatePoints($test, $data['pros'], true, $pointRepository, $em);
        $this->updatePoints($test, $data['cons'], false, $pointRepository, $em);

        // Sauvegarder les modifications
        $em->flush();

        return new JsonResponse(['message' => 'Test updated successfully'], 200);
    }

    private function updatePoints(Test $test, array $points, bool $isPositive, PointRepository $pointRepository, EntityManagerInterface $em)
    {
        // Supprimer les points existants
        $existingPoints = $pointRepository->findBy(['test' => $test, 'isPositive' => $isPositive]);
        foreach ($existingPoints as $existingPoint) {
            $em->remove($existingPoint);
        }

        // Ajouter les nouveaux points
        foreach ($points as $description) {
            if (!empty($description)) {
                $point = new Point();
                $point->setDescription($description);
                $point->setIsPositive($isPositive);
                $point->setTest($test);
                $em->persist($point);
            }
        }
    }
}
