<?php

namespace App\Repository;

use App\Entity\SideImages;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SideImages>
 *
 * @method SideImages|null find($id, $lockMode = null, $lockVersion = null)
 * @method SideImages|null findOneBy(array $criteria, array $orderBy = null)
 * @method SideImages[]    findAll()
 * @method SideImages[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SideImagesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SideImages::class);
    }

//    /**
//     * @return SideImages[] Returns an array of SideImages objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?SideImages
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
