<?php

namespace App\DataFixtures;

use App\Entity\Genre;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpClient\HttpClient;

class GenreFixtures extends Fixture
{
    private $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function load(ObjectManager $manager)
    {
        $httpClient = HttpClient::create();
        $apiKey = $this->apiKey;
        $response = $httpClient->request('GET', 'https://api.rawg.io/api/genres', [
            'query' => [
                'key' => $apiKey,
            ],
        ]);
        $genresData = $response->toArray()['results'];
        foreach ($genresData as $genreData) {
            $genre = new Genre();
            $genre->setName($genreData['name']);
            $manager->persist($genre);
        }
        $manager->flush();
    }

}
