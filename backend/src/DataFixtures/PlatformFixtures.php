<?php

namespace App\DataFixtures;

use App\Entity\Platform;
use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\HttpClient\HttpClient;

class PlatformFixtures extends Fixture
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
        $response = $httpClient->request('GET', 'https://api.rawg.io/api/platforms', [
            'query' => [
                'key' => $apiKey,
            ],
        ]);
        $platforms = $response->toArray()['results'];
        foreach ($platforms as $platformData) {
            $platform = new Platform();
            $platform->setName($platformData['name']);
            $manager->persist($platform);
        }
        $manager->flush();
    }

}
