<?php

namespace App\DataFixtures;

use App\Entity\Test;
use App\Entity\User;
use App\Entity\Vote;
use App\DataFixtures\TestFixtures;
use App\DataFixtures\UserFixtures;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class VoteFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        // Récupérer la liste de tests en BDD
        $tests = $manager->getRepository(Test::class)->findAll();

        // Récupérer la liste des utilisateurs en BDD
        $users = $manager->getRepository(User::class)->findAll();

        foreach ($tests as $test) {
            // Définir un nombre aléatoire de votes
            $numberOfVotes = rand(1, 3);
            $votedUsers = [];

            for ($i = 0; $i < $numberOfVotes; $i++) {
                // Sélectionner un utilisateur aléatoire
                $randomUser = $users[array_rand($users)];

                // Vérifier que l'utilisateur n'a pas déjà voté pour ce test
                if (in_array($randomUser->getId(), $votedUsers) || $randomUser === $test->getUser()) {
                    // Si l'utilisateur a déjà voté ou est le créateur du test, continuer la boucle
                    continue;
                }

                // Créer un nouveau vote
                $vote = new Vote();
                $voteValue = rand(0, 1);
                $vote->setVote($voteValue);
                $vote->setTest($test);
                $vote->setUser($randomUser);
                $manager->persist($vote);

                // Ajouter l'utilisateur à la liste des utilisateurs ayant déjà voté pour ce test
                $votedUsers[] = $randomUser->getId();
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            TestFixtures::class,
        ];
    }
}

