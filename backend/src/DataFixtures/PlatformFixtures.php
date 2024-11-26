<?php

namespace App\DataFixtures;

use App\Entity\Platform;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\HttpClient\HttpClient;

class PlatformFixtures extends Fixture
{
    private $apiKey;
    private $nonPhysicalPlatforms;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
        $this->nonPhysicalPlatforms = [
            'PlayStation 5', 'PlayStation 4', 'PC', 'iOS', 'Android', 'macOS', 'Linux', 'Nintendo Switch', 'Classic Macintosh', 'Apple II',
            'Xbox Series X', 'Xbox One', 'Xbox Series S/X'
        ];
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
            // Définir setIsPhysical en fonction du nom de la plateforme
            if (in_array($platformData['name'], $this->nonPhysicalPlatforms)) {
                $platform->setIsPhysical(0);
            } else {
                $platform->setIsPhysical(1);
            }
            $manager->persist($platform);
        }
        $manager->flush();
    }

}
