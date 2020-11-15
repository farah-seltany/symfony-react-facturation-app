<?php

namespace App\Repository;

use App\Entity\InVoice;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method InVoice|null find($id, $lockMode = null, $lockVersion = null)
 * @method InVoice|null findOneBy(array $criteria, array $orderBy = null)
 * @method InVoice[]    findAll()
 * @method InVoice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InVoiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InVoice::class);
    }

    // /**
    //  * @return InVoice[] Returns an array of InVoice objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?InVoice
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
