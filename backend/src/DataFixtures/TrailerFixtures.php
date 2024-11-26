<?php

namespace App\DataFixtures;

use App\Entity\Product;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpClient\HttpClient;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class TrailerFixtures extends Fixture implements DependentFixtureInterface
{
    private $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function load(ObjectManager $manager)
    {
        $products = $manager->getRepository(Product::class)->findAll();
        $httpClient = HttpClient::create();
        $youtubeApiKey = $this->apiKey;

        foreach ($products as $product) {
            $platforms = $product->getPlatform()->toArray();
            $firstPlatform = !empty($platforms) ? $platforms[0]->getName() : '';
            $trailerUrl = $this->getYoutubeTrailerUrl($httpClient, $product->getName(), $firstPlatform, $youtubeApiKey);

            if ($trailerUrl) {
                $videoPath = realpath(__DIR__ . '/../../public/uploads/videos/videogames/trailer') . '/' . uniqid() . '.%(ext)s';
                $videoFileName = $this->downloadVideo($trailerUrl, $videoPath);

                if ($videoFileName) {
                    dump("Trailer downloaded successfully: $videoFileName");
                    $product->setTrailer($videoFileName);
                } else {
                    dump("Failed to download trailer, using default video for: " . $product->getName());
                    $product->setTrailer('default_video_path.mp4');
                }

            } else {
                dump("No videoFileName found, using default video for: " . $product->getName());
                $product->setTrailer('default_video_path.mp4');
            }

            $manager->persist($product);
        }
        
        $manager->flush();
    }

    private function downloadVideo($url, $destination)
    {
        $outputDirectory = dirname($destination);
        $baseFileName = basename($destination, '.%(ext)s');

        // Commande yt-dlp
        $command = sprintf(
            'yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4" -o "%s" "%s"',
            $destination,
            $url
        );

        shell_exec($command);

        // Vérifier la présence d'un fichier .mp4
        $downloadedFiles = glob($outputDirectory . '/' . $baseFileName . '.*');

        if ($downloadedFiles) {
            foreach ($downloadedFiles as $file) {
                if (pathinfo($file, PATHINFO_EXTENSION) === 'mp4') {
                    dump("File successfully found: $file");
                    return basename($file);
                }
            }
        }

        return false;
    }



    private function getYoutubeTrailerUrl($httpClient, $gameName, $platform, $youtubeApiKey)
    {
        $searchQuery = $gameName . ' trailer ' . $platform . ' fr';

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
                $videoUrl = "https://www.youtube.com/watch?v={$videoId}";
                return $videoUrl;
            }
        }

        dump("No trailer found for: $gameName on platform: $platform");
        return null;
    }

    public function getDependencies(): array
    {
        return [
            GameFixtures::class,
        ];
    }
}
