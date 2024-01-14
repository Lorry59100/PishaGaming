<?php

namespace App\DataFixtures;

use App\Entity\Tag;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\HttpClient\HttpClient;

class TagFixtures extends Fixture
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
        $response = $httpClient->request('GET', 'https://api.rawg.io/api/tags', [
            'query' => [
                'key' => $apiKey,
            ],
        ]);
        $tagsData = $response->toArray()['results'];
        foreach ($tagsData as $tagData) {
            $tag = new Tag();
            $tag->setName($tagData['name']);
            $manager->persist($tag);
        }
        $manager->flush();
    }

}
