<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\DataFixtures\GameFixtures;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpClient\HttpClient;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class TrailerFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        //Récupérer la liste des jeux en BDD
        /* $products = $manager->getRepository(Product::class)->findAll();
        $httpClient = HttpClient::create();
        $youtubeApiKey = getenv('YTB_API_KEY');

        foreach ($products as $product) {
            $trailerUrl = $this->getYoutubeTrailerUrl($httpClient, $product->getName(), $youtubeApiKey);
            $product->setTrailer($trailerUrl);
            $manager->persist($product);
            $manager->flush();
        } */
    }

    // Méthode pour obtenir le trailer en fonction du jeu
    private function getYoutubeTrailerUrl($httpClient, $gameName, $youtubeApiKey)
{
    // Utilize logic to get the trailer from your second API (for example)
    // Modify this code based on your second API
    /* $searchQuery = $gameName . ' trailer fr';
    $response = $httpClient->request('GET', 'https://www.googleapis.com/youtube/v3/search', [
        'query' => [
            'part' => 'snippet',
            'q' => $searchQuery,
            'key' => $youtubeApiKey,
        ],
    ]);

    $youtubeData = $response->toArray();

    if (isset($youtubeData['items']) && count($youtubeData['items']) > 0) {
        $firstItem = $youtubeData['items'][0];

        if (isset($firstItem['id']['videoId'])) {
            $videoId = $firstItem['id']['videoId'];

            // Construct the embed link (iframe)
            $iframeUrl = "https://www.youtube.com/embed/{$videoId}";

            return $iframeUrl;
        }
    }

    return null; */
}

    public function getDependencies(): array
    {
        return [
            GameFixtures::class,
        ];
    }
}
