<?php

namespace App\Controller;

use App\Entity\Vote;
use Exception;
use App\Service\TokenService;
use App\Repository\TestRepository;
use App\Repository\VoteRepository;
use App\Repository\GenreRepository;
use App\Repository\ProductRepository;
use App\Repository\PlatformRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductsController extends AbstractController
{
    private $tokenService;

    #[Route('/products', name: 'app_products')]
    public function index(): Response
    {
        return $this->render('products/index.html.twig', [
            'controller_name' => 'ProductsController',
        ]);
    }

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }


    /**
     * @Route("/products-list", name="products_list", methods={"GET"})
     */

    public function productsList(ProductRepository $productRepository) : JsonResponse
    {
        $products = $productRepository->findAll();
        $productsArray = [];
        foreach($products as $product) {
            $genres = [];
            foreach($product->getGenre() as $genre) {
                $genres[] = [
                    'id' => $genre->getId(),
                    'name' => $genre->getName(),
                ];
            }
            $platforms = [];
            foreach($product->getPlatform() as $platform) {
                $platforms[] = [
                    'id' => $platform->getId(),
                    'name' => $platform->getName(),
                ];
            }
            $tags = [];
            foreach($product->getTag() as $tag) {
                $tags[] = [
                    'id' => $tag->getId(),
                    'name' => $tag->getName(),
                ];
            }

            $productsArray[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'trailer' => $product->getTrailer(),
                'dev' => $product->getDev(),
                'editor' => $product->getEditor(),
                'release' => $product->getRelease(),
                'description' => $product->getDescription(),
                'old_price' => $product->getOldPrice(),
                'price' => $product->getPrice(),
                'img' => $product->getImg(),
                'category' => $product->getCategory() ? [
                    'id' => $product->getCategory()->getId(),
                    'name' => $product->getCategory()->getName(),
                ] : null ,
                'edition' => $product->getEdition() ? [
                    'id' => $product->getEdition()->getId(),
                    'name' => $product->getEdition()->getName(),
                ] : null,
                'genres' => $genres,
                'platforms' => $platforms,
                'tags' => $tags,
            ];
        }
        return new JsonResponse($productsArray, 200);
    }

    /**
     * @Route("/single-product/{id}", name="single_product", methods={"GET"})
     */
    public function singleProduct(ProductRepository $productRepository, VoteRepository $voteRepository, Request $request, $id): JsonResponse | Response
    {
        try {
            $user = $this->tokenService->getUserFromRequest($request);

            // Vérifiez si $user est une instance de JsonResponse
            if ($user instanceof JsonResponse) {
                $user = null; // Traitez-le comme un utilisateur non connecté
            }

            $product = $productRepository->find($id);

            $platforms = [];
            foreach ($product->getPlatform() as $platform) {
                $platforms[] = [
                    'id' => $platform->getId(),
                    'name' => $platform->getName(),
                ];
            }

            $tags = [];
            foreach ($product->getTag() as $tag) {
                $tags[] = [
                    'id' => $tag->getId(),
                    'name' => $tag->getName(),
                ];
            }

            $tests = [];
            foreach ($product->getTests() as $test) {
                $upVotes = $voteRepository->count(['test' => $test, 'vote' => true]);
                $downVotes = $voteRepository->count(['test' => $test, 'vote' => false]);
                // Initialiser les variables en dehors de la boucle
                $hasVotedPositive = false;
                $hasVotedNegative = false;
                $points = $test->getPoints();

                if ($user) {
                    foreach ($test->getVote() as $vote) {
                        if ($vote->getUser()->getEmail() == $user->getEmail()) {
                            if ($vote->isVote() == true) {
                                $hasVotedPositive = true;
                            } else if ($vote->isVote() == false) {
                                $hasVotedNegative = true;
                            }
                        }
                    }
                    // Vérifier si l'utilisateur a déjà rédigé un test pour ce jeu
                    $userTests = $user->getTests();
                    $testExist = false;
                    foreach($userTests as $userTest) {
                        if($userTest->getProduct() === $product) {
                            $testExist = true;
                        }
                    }
                }

                $tests[] = [
                    'id' => $test->getId(),
                    'commentaires' => $test->getComment(),
                    'rate' => $test->getRate(),
                    'publisher' => $test->getUser()->getPseudo(),
                    'avatar' => $test->getUser()->getImg(),
                    'date' => $test->getCreatedAt(),
                    'testExist' => $testExist,
                    'upVotes' => $upVotes,
                    'downVotes' => $downVotes,
                    'hasVotedPositive' => $hasVotedPositive,
                    'hasVotedNegative' => $hasVotedNegative,
                    'points' => array_map(function($point) {
                        return [
                            'description' => $point->getDescription(),
                            'isPositive' => $point->isIsPositive(),
                        ];
                    }, $test->getPoints()->toArray()),
                ];
            }

            $genres = [];
            foreach ($product->getGenre() as $genre) {
                $genres[] = [
                    'id' => $genre->getId(),
                    'name' => $genre->getName(),
                ];
            }

            $alternativeEditions = $productRepository->getAlternativeEditions($product->getName(), $product->getEdition()->getId());
            $alternativeEditionsArray = [];
            foreach ($alternativeEditions as $alternativeEdition) {
                $alternativeEditionsArray[] = [
                    'id' => $alternativeEdition['id'],
                    'name' => $alternativeEdition['name'],
                    'img' => $alternativeEdition['img'],
                    'old_price' => $alternativeEdition['old_price'],
                    'price' => $alternativeEdition['price'],
                    'stock' => $alternativeEdition['stock'],
                    'description' => $alternativeEdition['description'],
                    'edition_id' => $alternativeEdition['edition_id'],
                    'edition_name' => $alternativeEdition['edition_name'],
                ];
            }

            $productsArray = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'stock' => $product->getStock(),
                'old_price' => $product->getOldPrice(),
                'price' => $product->getPrice(),
                'img' => $product->getImg(),
                'description' => $product->getDescription(),
                'category' => $product->getCategory()->getName(),
                'developer' => $product->getDev(),
                'editor' => $product->getEditor(),
                'release' => $product->getRelease(),
                'stock' => $product->getStock(),
                'edition' => $product->getEdition()->getName(),
                'trailer' => $product->getTrailer(),
                'genres' => $genres,
                'plateformes' => $platforms,
                'tags' => $tags,
                'tests' => $tests,
                'alternative_editions' => $alternativeEditionsArray,
            ];

            return new JsonResponse($productsArray, 200);
        } catch (Exception $e) {
            return new JsonResponse(['error' => 'Internal Server Error'], 500);
        }
    }

    /**
     * @Route("/plateformes-list", name="plateformes_list", methods={"GET"})
     */
    public function plateformesList(PlatformRepository $plateformeRepository): JsonResponse
    {
        $plateformes = $plateformeRepository->findAll();
        $plateformesArray = [];
        foreach ($plateformes as $plateforme) {
            $plateformesArray[] = [
                'name' => $plateforme->getName(),
                'id' => $plateforme->getId(),
            ];
        }
        return new JsonResponse($plateformesArray, 200);
    }

    /**
     * @Route("/genres-list", name="genres_list", methods={"GET"})
     */
    public function genresList(GenreRepository $genreRepository): JsonResponse
    {
        $genres = $genreRepository->findAll();
        $genresArray = [];
        foreach ($genres as $genre) {
            $genresArray[] = [
                'name' => $genre->getName(),
                'id' => $genre->getId()
            ];
        }
        return new JsonResponse($genresArray, 200);
    }

    /**
     * @Route("/vote-test/{id}", name="vote_test", methods={"POST"})
     */
    public function voteTest(EntityManagerInterface $em, VoteRepository $voteRepository, TestRepository $testRepository, Request $request, $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Récupérer l'utilisateur
        $user = $this->tokenService->getUserFromRequest($request);

        // Récupérer les données du test
        $test = $testRepository->find($id);

        if (!$test) {
            return new JsonResponse('Test not found', 404);
        }

        // Détecter si l'utilisateur a déjà voté pour ce test
        $hasVoted = false;
        foreach ($test->getVote() as $vote) {
            if ($vote->getUser() === $user) {
                $hasVoted = true;
                break;
            }
        }

        if ($hasVoted) {
            return new JsonResponse('User has already voted for this test', 400);
        }

        // Détecter le type de vote (positif ou négatif)
        $isPositive = $data['isPositive'];

        // Créer un nouveau vote
        $vote = new Vote();
        $vote->setVote($isPositive);
        $vote->setTest($test);
        $vote->setUser($user);

        // Sauvegarder le vote
        $em->persist($vote);
        $em->flush();

        $upVotes = $voteRepository->count(['test' => $test, 'vote' => true]);
        $downVotes = $voteRepository->count(['test' => $test, 'vote' => false]);

        return new JsonResponse([
            'upVotes' => $upVotes,
            'downVotes' => $downVotes,
            'hasVotedPositive' => $isPositive,
            'hasVotedNegative' => !$isPositive
        ], 200);
    }
}
