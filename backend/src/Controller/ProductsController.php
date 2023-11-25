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
            $categorys = [];
            foreach($product->getCategory() as $category) {
                $categorys[] = [
                    'id' => $category->getId(),
                    'name' => $category->getName(),
                ];
            }
            $editions = [];
            foreach($product->getEdition() as $edition) {
                $editions[] = [
                    'id' => $edition->getId(),
                    'name' => $edition->getName(),
                ];
            }
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
                'categorys' => $categorys,
                'editions' => $editions,
                'genres' => $genres,
                'platforms' => $platforms,
                'tags' => $tags,
            ];
        }
        return new JsonResponse($productsArray, 200);
    }
}
