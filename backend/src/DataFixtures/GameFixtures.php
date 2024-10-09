<?php

namespace App\DataFixtures;

use App\Entity\Tag;
use App\Entity\Genre;
use App\Entity\Edition;
use App\Entity\Product;
use App\Entity\Platform;
use App\DataFixtures\EditionFixtures;
use App\DataFixtures\CategoryFixtures;
use App\DataFixtures\PlatformFixtures;
use App\Entity\Category;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpClient\HttpClient;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class GameFixtures extends Fixture implements DependentFixtureInterface
{
    private $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function load(ObjectManager $manager)
    {
        $apiKey = $this->apiKey;
        $this->fetchGamesFromApi($manager, $apiKey, '1980-01-01,2000-12-31', 25, 2);
        $this->fetchGamesFromApi($manager, $apiKey, '2000-01-01,2023-12-31', 25, 1);
        $this->fetchGamesFromApi($manager, $apiKey, '2000-01-01,2023-12-31', 25, 2);
        $this->fetchGamesFromApi($manager, $apiKey, '2000-01-01,2023-12-31', 25, 3);
    }

    private function downloadImage($url, $destination)
    {
        $httpClient = HttpClient::create();
        $response = $httpClient->request('GET', $url);

        if ($response->getStatusCode() === 200) {
            file_put_contents($destination, $response->getContent());
            return basename($destination); // Retourne uniquement le nom du fichier
        }

        return false;
    }

    private function fetchGamesFromApi(ObjectManager $manager, $apiKey, $dates, $pageSize, $page) {
        $httpClient = HttpClient::create();

        $retroGamesResponse = $httpClient->request('GET', 'https://api.rawg.io/api/games', [
            'query' => [
                'key' => $apiKey,
                'dates' => $dates,
                'page_size' => $pageSize,
                'page' => $page
            ],
        ]);
        $retroGamesData = $retroGamesResponse->toArray();
    
        /* Boucler sur la liste des jeux */
        foreach ($retroGamesData['results'] as $retroGameData) {
            /* Récupérer l'Id du jeu */
            $gameId = $retroGameData['id'];
    
            /* Effectuer une requête pour obtenir l'id du jeu */
            $singleGameResponse = $httpClient->request('GET', "https://api.rawg.io/api/games/{$gameId}", [
                'query' => [
                    'key' => $apiKey,
                ],
            ]);
            $gameData = $singleGameResponse->toArray();

            /* Vérifier si un jeu avec ce nom existe déjà en BDD */
            $existingGame = $manager->getRepository(Product::class)->findOneBy(['name' => $gameData['name']]);

            /* Si il n'existe pas on persist les données */
            if ($existingGame === null) {
                $game = new Product();
                $game->setName($gameData['name']);
                $game->setDescription($gameData['description']);
                $game->setRelease(new \DateTime($gameData['released']));
                if (!empty($gameData['publishers'])) {
                    $game->setEditor($gameData['publishers'][0]['name']);
                } else {
                    $game->setEditor('inconnu');
                }
                if (!empty($gameData['developers'])) {
                    $game->setDev($gameData['developers'][0]['name']);
                } else {
                    $game->setDev('inconnu');
                }

                // Télécharger et enregistrer l'image
                $imageUrl = $gameData['background_image'];
                $imagePath = __DIR__ . '/../../public/uploads/images/products/videogames/main_img/' . uniqid() . '.jpg';
                $imageFileName = $this->downloadImage($imageUrl, $imagePath);
                if ($imageFileName) {
                    $game->setImg($imageFileName);
                } else {
                    $game->setImg('default_image_path.jpg'); // Chemin par défaut si le téléchargement échoue
                }
                
                $game->setStock(rand(0, 99));

                $game->setOldPrice(rand(100, 15000));
                // Calculate the discounted price
                $discountPercentage = rand(5, 95);
                $discountFactor = $discountPercentage / 100;
                $calculatedPrice = $game->getOldPrice() - ($game->getOldPrice() * $discountFactor);
                // Set the calculated price
                $game->setPrice($calculatedPrice);

                $edition = $manager->getRepository(Edition::class)->findOneBy(['name' => 'Standart']);
                if ($edition !== null) {
                    $game->setEdition($edition);
                }
                $category = $manager->getRepository(Category::class)->findOneBy(['name' => 'Jeux Vidéos']);
                    if ($category !== null) {
                $game->setCategory($category);
                }

                foreach ($gameData['platforms'] as $platformData) {
                    $platformName = $platformData['platform']['name'];
                    $existingPlatform = $manager->getRepository(Platform::class)->findOneBy(['name' => $platformName]);
                    if ($existingPlatform !== null) {
                        $game->addPlatform($existingPlatform);
                    }
                }

                foreach ($gameData['tags'] as $tagName) {
                    $tag = $manager->getRepository(Tag::class)->findOneBy(['name' => $tagName]);
                    if ($tag !== null) {
                        $game->addTag($tag);
                    }
                }

                foreach ($gameData['genres'] as $genreName) {
                    $genre = $manager->getRepository(Genre::class)->findOneBy(['name' => $genreName]);
                    if ($genre !== null) {
                        $game->addGenre($genre);
                    } 
                }
                $manager->persist($game);
            }
        }
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            PlatformFixtures::class,
            TagFixtures::class,
            GenreFixtures::class,
            EditionFixtures::class,
            CategoryFixtures::class,
        ];
    }
}
