<?php

namespace App\Controller;

use App\Repository\TagRepository;
use App\Repository\GenreRepository;
use App\Repository\CategoryRepository;
use App\Repository\PlatformRepository;
use App\Repository\EditionCategoryRepository;
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
}
