<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
}
