<?php

namespace App\DataFixtures;

use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\HttpClient\HttpClient;

class GameFixtures extends Fixture
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
                            'description' => $this->getGameDescription($httpClient, $developerGame['id'], $apiKey),
                            'release_date' => $this->getGameReleaseDate($httpClient, $developerGame['id'], $apiKey),
                        ];
                        $game = new Product();
                        $game->setName($developerGame['name']);
                        $game->setDescription($gameData['description']);
                        $game->setRelease(new \DateTime($gameData['release_date']));
                        $game->setIsPhysical(false);
                        $game->setDev($developerName);
                        $game->setEditor($publisherName);
                        // Ajoutez d'autres attributs du jeu en fonction de votre modèle

                        $manager->persist($game);
                    }
                }
            }
        }

        $manager->flush();
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

    private function getGameDescription($httpClient, $gameId, $apiKey)
    {
    $gameResponse = $httpClient->request('GET', "https://api.rawg.io/api/games/{$gameId}", [
        'query' => [
            'key' => $apiKey,
        ],
    ]);

    $gameData = $gameResponse->toArray();

    return $gameData['description'] ?? null;
    }

    private function getGameReleaseDate($httpClient, $gameId, $apiKey)
{
    $gameResponse = $httpClient->request('GET', "https://api.rawg.io/api/games/{$gameId}", [
        'query' => [
            'key' => $apiKey,
        ],
    ]);

    $gameData = $gameResponse->toArray();

    return $gameData['released'] ?? null;
}
}
