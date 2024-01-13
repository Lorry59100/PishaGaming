<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\Platform;
use App\DataFixtures\PlatformFixtures;
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
        $httpClient = HttpClient::create();

        $developersResponse = $httpClient->request('GET', 'https://api.rawg.io/api/developers', [
            'query' => [
                'key' => $apiKey,
            ],
        ]);

        $developersData = $developersResponse->toArray();

        $publishersResponse = $httpClient->request('GET', 'https://api.rawg.io/api/publishers', [
            'query' => [
                'key' => $apiKey,
            ],
        ]);

        $publishersData = $publishersResponse->toArray();

        foreach ($developersData['results'] as $developerData) {
            $developerName = $developerData['name'];
            $developerGames = $this->getGamesForEntity($httpClient, $developerData['id'], 'developer');

            foreach ($publishersData['results'] as $publisherData) {
                $publisherName = $publisherData['name'];
                $publisherGames = $this->getGamesForEntity($httpClient, $publisherData['id'], 'publisher');

                foreach ($developerGames as $developerGame) {
                    if (in_array($developerGame, $publisherGames, true)) {
                        $gameData = $developerGame + [
                            'description' => $this->getGameDataProperty($httpClient, $developerGame['id'], $apiKey, 'description'),
                            'release_date' => $this->getGameDataProperty($httpClient, $developerGame['id'], $apiKey, 'released'),
                            'name' => $this->getGameDataProperty($httpClient, $developerGame['id'], $apiKey, 'name'),
                            'img' => $this->getGameDataProperty($httpClient, $developerGame['id'], $apiKey, 'background_image'),
                            'platforms'=> $this->getGameDataProperty($httpClient, $developerGame['id'], $apiKey, 'parent_platforms'),
                        ];
                        $existingGame = $manager->getRepository(Product::class)->findOneBy(['name' => $developerGame['name']]);
                        if($existingGame === null) {

                            $game = new Product();
                            $game->setName($developerGame['name']);
                            $game->setDescription($gameData['description']);
                            $game->setRelease(new \DateTime($gameData['release_date']));
                            $game->setIsPhysical(false);
                            $game->setDev($developerName);
                            $game->setEditor($publisherName);
                            $game->setImg($gameData['img']);
                            $game->setStock(rand(0, 99));
                            $game->setOldPrice(rand(100, 15000));
                            
                            // Calculate the discounted price
                            $discountPercentage = rand(5, 95);
                            $discountFactor = $discountPercentage / 100;
                            $calculatedPrice = $game->getOldPrice() - ($game->getOldPrice() * $discountFactor);

                            // Set the calculated price
                            $game->setPrice($calculatedPrice);

                            foreach ($gameData['platforms'] as $platformData) {
                                $platformName = $platformData['platform']['name'];
                                $existingPlatform = $manager->getRepository(Platform::class)->findOneBy(['name' => $platformName]);
                            
                                if ($existingPlatform !== null) {
                                    $game->addPlatform($existingPlatform);
                                }
                            }
    
                            $manager->persist($game);
                            $manager->flush();
                        }
                    }
                }
            }
        }
    }

    private function getGamesForEntity($httpClient, $entityId, $entityType)
    {
        $apiKey = $this->apiKey;
        $gamesResponse = $httpClient->request('GET', 'https://api.rawg.io/api/games', [
            'query' => [
                'key' => $apiKey,
                $entityType . 's' => $entityId,
            ],
        ]);

        $gamesData = $gamesResponse->toArray();

        return $gamesData['results'];
    }

    private function getGameDataProperty($httpClient, $gameId, $apiKey, $property)
    {
        $gameResponse = $httpClient->request('GET', "https://api.rawg.io/api/games/{$gameId}", [
            'query' => [
                'key' => $apiKey,
            ],
        ]);

        $gameData = $gameResponse->toArray();

        return $gameData[$property] ?? null;
    }

    public function getDependencies(): array
    {
        return [
            PlatformFixtures::class,
        ];
    }
}
