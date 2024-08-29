<?php

namespace App\DataFixtures;

use App\Entity\Test;
use App\Entity\User;
use App\Entity\Product;
use App\DataFixtures\UserFixtures;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class TestFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Récupérer la liste de produits en BDD
        $products = $manager->getRepository(Product::class)->findAll();

        // Récupérer la liste des utilisateurs en BDD
        $users = $manager->getRepository(User::class)->findAll();

        // Commentaires prédéfinis en fonction de la note
        $commentsByRange = [
            [0, 3, "Très décevant, à éviter."],
            [4, 6, "Médiocre, facilement améliorable."],
            [7, 9, "Moyen, rien d'exceptionnel."],
            [10, 12, "Produit moyen."],
            [13, 15, "Bon produit, à essayer !"],
            [16, 18, "Frôle la perfection!"],
            [19, 20, "Parfait, incontournable!"]
        ];

        foreach ($products as $product) {
            // Sélectionner un nombre aléatoire d'utilisateurs (entre 0 et 5)
            $numberOfUsers = rand(0, 5);

            if ($numberOfUsers > 0) {
                // Sélectionner les utilisateurs aléatoirement
                $selectedUsers = array_rand($users, $numberOfUsers);

                // Vérifier si $selectedUsers est un tableau ou un entier
                if (is_array($selectedUsers)) {
                    foreach ($selectedUsers as $userIndex) {
                        $this->createTest($manager, $product, $users[$userIndex], $commentsByRange);
                    }
                } else {
                    $this->createTest($manager, $product, $users[$selectedUsers], $commentsByRange);
                }
            }
        }
        $manager->flush();
    }

    private function createTest(ObjectManager $manager, Product $product, User $user, array $commentsByRange): void
    {
        $test = new Test();
        $rate = rand(0, 20);
        $range = '';
        foreach ($commentsByRange as $bounds) {
            list($min, $max, $comment) = $bounds;
            if ($rate >= $min && $rate <= $max) {
                $range = $comment;
                break;
            }
        }
        $test->setProduct($product);
        $test->setComment($range);
        $test->setRate($rate);
        $test->setUser($user);

        // Ajouter une date aléatoire entre maintenant et l'année 2000
        $startDate = new \DateTimeImmutable('2000-01-01');
        $endDate = new \DateTimeImmutable();
        $randomTimestamp = rand($startDate->getTimestamp(), $endDate->getTimestamp());
        $randomDate = new \DateTimeImmutable('@' . $randomTimestamp);
        $test->setCreatedAt($randomDate);

        $manager->persist($test);
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
