<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 *
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function getAlternativeEditions(string $productName, int $editionId): ?array
{
    $conn = $this->getEntityManager()->getConnection();
    $sql = 'SELECT p.id, p.name, p.edition_id, p.img, p.old_price, p.price, p.stock, p.description, e.name AS edition_name
    FROM product p
    JOIN edition e ON p.edition_id = e.id
    WHERE p.name = :productName AND p.edition_id != :editionId';;
    $stmt = $conn->prepare($sql);
    $resultSet = $stmt->executeQuery([
        'productName' => $productName,
        'editionId' => $editionId,
    ]);

    return $resultSet->fetchAllAssociative();
}
//    /**
//     * @return Product[] Returns an array of Product objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Product
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
