<?php

namespace App\Controller;

use App\Repository\GenreRepository;
use Exception;
use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProductsController extends AbstractController
{
    #[Route('/products', name: 'app_products')]
    public function index(): Response
    {
        return $this->render('products/index.html.twig', [
            'controller_name' => 'ProductsController',
        ]);
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
    public function singleProduct(ProductRepository $productRepository, $id): JsonResponse | Response
    {
      try  {
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
                $tests[] = [
                    'id' => $test->getId(),
                    'commentaires' => $test->getComment(),
                    'rate' => $test->getRate(),
                ];
            }

            $genres = [];
            foreach($product->getGenre() as $genre) {
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
        } 
        
        catch(Exception $e) {
            return new JsonResponse(['error' => 'Internal Server Error'], 500);
        }
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
            ];
        }
        return new JsonResponse($genresArray, 200);
    }

}
