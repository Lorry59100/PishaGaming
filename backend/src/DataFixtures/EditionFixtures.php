<?php

namespace App\DataFixtures;

use App\Entity\Edition;
use App\Entity\Genre;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpClient\HttpClient;

class EditionFixtures extends Fixture
{

    public function load(ObjectManager $manager)
    {
        $edition = new Edition();
        $edition->setName('Standart');
        $manager->persist($edition);
        $manager->flush();
    }

}
