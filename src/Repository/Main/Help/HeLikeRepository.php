<?php

namespace App\Repository\Main\Help;

use App\Entity\Main\Help\HeLike;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<HeLike>
 *
 * @method HeLike|null find($id, $lockMode = null, $lockVersion = null)
 * @method HeLike|null findOneBy(array $criteria, array $orderBy = null)
 * @method HeLike[]    findAll()
 * @method HeLike[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HeLikeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HeLike::class);
    }

    public function save(HeLike $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(HeLike $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return HeLike[] Returns an array of HeLike objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('h')
//            ->andWhere('h.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('h.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?HeLike
//    {
//        return $this->createQueryBuilder('h')
//            ->andWhere('h.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
