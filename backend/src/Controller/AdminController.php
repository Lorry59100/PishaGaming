<?php

namespace App\Controller;

use DateTime;
use App\Entity\Edition;
use App\Entity\Product;
use App\Repository\TagRepository;
use App\Repository\GenreRepository;
use App\Repository\EditionRepository;
use App\Repository\CategoryRepository;
use App\Repository\PlatformRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\EditionCategoryRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'app_admin')]
    public function index(): Response
    {
        return $this->render('admin/index.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }

    /**
     * @Route("/sub-lists", name="sub_lists", methods={"GET"})
     */

     public function subLists(CategoryRepository $categoryRepository, EditionCategoryRepository $editionCategoryRepository, GenreRepository $genreRepository, 
     PlatformRepository $platformRepository, TagRepository $tagRepository) {
        $categories = $categoryRepository->findAll();
        $categoryArray = [];
        foreach ($categories as $category) {
            $categoryArray[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
        ];
        }
        $editionCategories = $editionCategoryRepository->findAll();
        $editionCategoryArray = [];
        foreach ($editionCategories as $editionCategory) {
            $editionCategoryArray[] = [
                'id' => $editionCategory->getId(),
                'name' => $editionCategory->getName(),
        ];
        }
        $genres = $genreRepository->findAll();
        $genreArray = [];
        foreach ($genres as $genre) {
        $genreArray[] = [
            'id' => $genre->getId(),
            'name' => $genre->getName(),
        ];
        }
        $platforms = $platformRepository->findAll();
        $platformArray = [];
        foreach ($platforms as $platform) {
        $platformArray[] = [
            'id' => $platform->getId(),
            'name' => $platform->getName(),
        ];
        }
        $tags = $tagRepository->findAll();
        $tagArray = [];
        foreach ($tags as $tag) {
        $tagArray[] = [
            'id' => $tag->getId(),
            'name' => $tag->getName(),
        ];
        }
        return new JsonResponse([
            'categories' => $categoryArray,
            'editionCategories' => $editionCategoryArray,
            'genres' => $genreArray,
            'platforms' => $platformArray,
            'tags' => $tagArray,
        ], 200);
     }

     /**
     * @Route("/add-product", name="add_product", methods={"POST"})
     */

     public function addproduct(Request $request, EntityManagerInterface $em, CategoryRepository $categoryRepository, EditionRepository $editionRepository,
     EditionCategoryRepository $editionCategoryRepository,GenreRepository $genreRepository, PlatformRepository $platformRepository,
     TagRepository $tagRepository) {
        $data = json_decode($request->getContent(), true);
        $product = new Product;
        $category = $categoryRepository->find($data['category']);
        $tags = $this->getEntitiesByIds($data['tags'], $tagRepository);
        foreach ($tags as $tag) {
            $product->addTag($tag);
        }
        $genres = $this->getEntitiesByIds($data['genres'], $genreRepository);
        foreach ($genres as $genre) {
            $product->addGenre($genre);
        }
        $platforms = $this->getEntitiesByIds($data['platforms'], $platformRepository);
        foreach ($platforms as $platform) {
            $product->addPlatform($platform);
        }
        $editions = $this->createEditions($data['editions'], $em, $editionCategoryRepository);
        foreach ($editions as $edition) {
            $product->addEdition($edition);
        }
        $release = new \DateTime($data['release']);
        $product->setName($data['name'])
                ->setTrailer($data['trailer'])
                ->setDev($data['dev'])
                ->setDescription($data['description'])
                ->setEditor($data['editor'])
                ->setRelease($release)
                ->addCategory($category);
        $em->persist($product);
        $em->flush();
        return new JsonResponse($data, 200);
     }

    private function createEditions(array $editionData, EntityManagerInterface $em, EditionCategoryRepository $editionCategoryRepository): array
    {
        $editions = [];
        foreach ($editionData as $editionItem) {
            $editionId = $editionItem['edition'];
            $editionCategory = $editionCategoryRepository->find($editionId);
            $oldPrice = $editionItem['old_price'];
            $price = $editionItem['price'];
            $img = $editionItem['img'];
            $stock = $editionItem['stock'];
            if ($editionCategory) {
                $edition = new Edition();
                $edition->setEditionCategory($editionCategory)
                    ->setOldPrice($oldPrice)
                    ->setPrice($price)
                    ->setImg($img)
                    ->setStock($stock);
                $em->persist($edition);
                $em->flush();
                $editions[] = $edition;
            } 
        }
        return $editions;
    }

    private function getEntitiesByIds(array $entityIds, $repository): array
    {
        $entities = [];
        foreach ($entityIds as $entityId) {
            $entity = $repository->find($entityId);
            if ($entity) {
                $entities[] = $entity;
            }
        }
        return $entities;
    }
}
