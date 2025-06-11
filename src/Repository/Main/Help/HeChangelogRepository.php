<?php

namespace App\Repository\Main\Help;

use App\Entity\Main\Help\HeChangelog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<HeChangelog>
 */
class HeChangelogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HeChangelog::class);
    }

    public function save(HeChangelog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(HeChangelog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @return HeChangelog[] Returns an array of HeChangelog objects
     */
    public function findLastTenBeforeNumero(int $numero): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.numero <= :numero')
            ->setParameter('numero', $numero)
            ->orderBy('e.numero', 'DESC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return HeChangelog[] Returns an array of HeChangelog objects
     */
    public function findBetweenNumeros(int $minNumero, int $maxNumero): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.numero BETWEEN :minNumero AND :maxNumero')
            ->setParameter('minNumero', $minNumero)
            ->setParameter('maxNumero', $maxNumero)
            ->orderBy('e.numero', 'DESC')
            ->getQuery()
            ->getResult();
    }



    //    /**
    //     * @return HeChangelog[] Returns an array of HeChangelog objects
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

    //    public function findOneBySomeField($value): ?HeChangelog
    //    {
    //        return $this->createQueryBuilder('h')
    //            ->andWhere('h.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
