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
    private $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function load(ObjectManager $manager)
    {
        // Récupérer la liste des jeux en BDD
        $products = $manager->getRepository(Product::class)->findAll();
        $httpClient = HttpClient::create();
        $youtubeApiKey = $this->apiKey;

        foreach ($products as $product) {
            $platforms = $product->getPlatform()->toArray();
            $firstPlatform = !empty($platforms) ? $platforms[0]->getName() : '';
            $trailerUrl = $this->getYoutubeTrailerUrl($httpClient, $product->getName(), $firstPlatform, $youtubeApiKey);
            if ($trailerUrl) {
                $videoPath = __DIR__ . '/../../public/uploads/videos/videogames/trailer/' . uniqid() . '.%(ext)s';
                $videoFileName = $this->downloadVideo($trailerUrl, $videoPath);
                if ($videoFileName) {
                    $product->setTrailer($videoFileName);
                } else {
                    $product->setTrailer('default_video_path.mp4'); // Chemin par défaut si le téléchargement échoue
                }
                $manager->persist($product);
            }
        }
        $manager->flush();
    }

    private function downloadVideo($url, $destination)
    {
        // Utiliser yt-dlp pour télécharger la vidéo
        $command = sprintf('yt-dlp -o "%s" "%s"', $destination, $url);
        $output = shell_exec($command);

        // Vérifier si le fichier a été téléchargé correctement
        $downloadedFiles = glob(dirname($destination) . '/' . basename($destination, '.%(ext)s') . '.*');

        if (count($downloadedFiles) > 0) {
            $downloadedFile = $downloadedFiles[0];
            $fileExtension = pathinfo($downloadedFile, PATHINFO_EXTENSION);

            // Si le fichier n'est pas en .mp4, le convertir
            if ($fileExtension !== 'mp4') {
                $mp4File = str_replace('.' . $fileExtension, '.mp4', $downloadedFile);
                $convertCommand = sprintf('ffmpeg -i "%s" "%s"', $downloadedFile, $mp4File);
                shell_exec($convertCommand);

                // Supprimer le fichier original après conversion
                unlink($downloadedFile);

                return basename($mp4File);
            }

            return basename($downloadedFile);
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

                // Construct the direct video URL
                $videoUrl = "https://www.youtube.com/watch?v={$videoId}";

                return $videoUrl;
            }
        }

        return null;
    }

    public function getDependencies(): array
    {
        return [
            GameFixtures::class,
        ];
    }
}
