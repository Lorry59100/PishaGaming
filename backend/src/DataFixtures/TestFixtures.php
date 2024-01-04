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
        // Récuperer la liste de produits en BDD
        $products = $manager->getRepository(Product::class)->findAll();

        // Récuperer la liste des utilisateurs en BDD
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
            // Définir un nombre aléatoire de tests
            $numberOfTests = rand(1, 20);

            for ($i = 0; $i < $numberOfTests; $i++) {
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
                $randomUser = $users[array_rand($users)];
                $test->setUser($randomUser);
                $manager->persist($test);
            }
        }
        $manager->flush();
        }

        public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
