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
        
        $editionCategory = $editionCategoryRepository->find($data['edition']);
        $edition = new Edition;
        $edition->setEditionCategory($editionCategory)
                ->setOldPrice($data['old_price'])
                ->setPrice($data['price'])
                ->setStock($data['stock'])
                ->setImg($data['img']);
        $em->persist($edition);
        $em->flush(); 

        $tagIds = $data['tags'];
        $tags = [];
        foreach($tagIds as $tagId) {
        $tag = $tagRepository->find($tagId);
        if ($tag) {
        $tags[] = $tag;
        }
        }

        foreach ($tags as $tag) {
        $product->addTag($tag);
        }

        $genre = $genreRepository->find($data['genre']);
        $platform = $platformRepository->find($data['platform']);
        $release = new \DateTime($data['release']);
        $product->setName($data['name'])
                ->setTrailer($data['trailer'])
                ->setDev($data['dev'])
                ->setDescription($data['description'])
                ->setEditor($data['editor'])
                ->setRelease($release)
                ->addCategory($category)
                ->addEdition($edition)
                ->addGenre($genre)
                ->addPlatform($platform);
        $em->persist($product);
        $em->flush();
        return new JsonResponse($data, 200);
     }
}
