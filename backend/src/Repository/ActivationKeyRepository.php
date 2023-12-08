<?php

namespace App\Repository;

use App\Entity\ActivationKey;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ActivationKey>
 *
 * @method ActivationKey|null find($id, $lockMode = null, $lockVersion = null)
 * @method ActivationKey|null findOneBy(array $criteria, array $orderBy = null)
 * @method ActivationKey[]    findAll()
 * @method ActivationKey[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ActivationKeyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ActivationKey::class);
    }

//    /**
//     * @return ActivationKey[] Returns an array of ActivationKey objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ActivationKey
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
