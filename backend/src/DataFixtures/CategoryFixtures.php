<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class CategoryFixtures extends Fixture
{

    public function load(ObjectManager $manager)
    {
        $videoGameCat = new Category();
        $videoGameCat->setName("Jeux Vidéos");
        $manager->persist($videoGameCat);

        $hardwareGameCat = new Category();
        $hardwareGameCat->setName("Hardware");
        $manager->persist($hardwareGameCat);
        
        $manager->flush();
    }

}
