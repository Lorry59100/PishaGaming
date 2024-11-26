<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;

class UserFixtures extends Fixture
{
    public function __construct( private UserPasswordHasherInterface $passwordHasher) {

    }

    public function load(ObjectManager $manager): void
    {
        // Création d'un utilisateur de type "admin"
        $admin = new User();

        /* Créer un token */
        $randomString = bin2hex(random_bytes(16));
        $timestamp = time();
        $expirationTimestamp = $timestamp + 86400;
        $dateTime = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
        $dateTime->setTimestamp($expirationTimestamp);
        $token = $randomString . $timestamp;
        // Obtenir les 5 premiers chiffres du timestamp
        $timestampPrefix = substr($timestamp, 0, 5);
        $pseudo = 'gamer-' . $timestampPrefix . '-0';

        /* $adminpassword = $_ENV['ADMIN_PASSWORD']; */
        $faker = \Faker\Factory::create('fr_FR');
        $dateBirthday = \DateTime::createFromFormat('d/m/Y', '17/04/1988', new \DateTimeZone('UTC'));

        $admin->setRoles(['ROLE_ADMIN'])
            ->setEmail('pisha@hotmail.fr')
            ->setBirthdate($dateBirthday)
            ->setPassword($this->passwordHasher->hashPassword($admin, $_ENV['ADMIN_PASSWORD']))
            ->setIsVerified(true)
            ->setPseudo($pseudo)
            ->setCreatedAt(new \DateTimeImmutable('now'));

        $manager->persist($admin);

        for ($i = 0; $i < 10; $i++) {
            $user = new User();
            $timestamp = time();
            $timestampPrefix = substr($timestamp, 0, 5);
            $pseudo = 'gamer-' . $timestampPrefix . '-' . $i+1;
            $user->setRoles(['ROLE_USER'])
                ->setEmail($faker->email())
                ->setPassword($this->passwordHasher->hashPassword($user, 'user'))
                ->setToken($token)
                ->setTokenExpiration($dateTime)
                ->setIsVerified(false)
                ->setBirthdate($dateBirthday)
                ->setPseudo($pseudo)
                ->setCreatedAt(new \DateTimeImmutable('now'));
            $manager->persist($user);
        }

        for ($i = 0; $i < 10; $i++) {
            $userConfirmed = new User();
            $timestamp = time();
            $timestampPrefix = substr($timestamp, 0, 5);
            $pseudo = 'gamer-' . $timestampPrefix . '-' . $i+11;
            $userConfirmed->setRoles(['ROLE_USER'])
                ->setEmail($faker->email())
                ->setPassword($this->passwordHasher->hashPassword($userConfirmed, 'user'))
                ->setIsVerified(true)
                ->setBirthdate(\DateTime::createFromFormat('Y-m-d', $faker->dateTimeBetween('-50 years', '-18 years')->format('Y-m-d')))
                ->setPseudo($pseudo)
                ->setCreatedAt(new \DateTimeImmutable('now'));
            $manager->persist($userConfirmed);
        }

        $manager->flush();
    }
}
