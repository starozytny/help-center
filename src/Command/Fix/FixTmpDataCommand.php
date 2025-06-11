<?php

namespace App\Command\Fix;

use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'fix:tmp:data',
    description: 'fix data tmp',
)]
class FixTmpDataCommand extends Command
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct();

        $this->registry = $registry;
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Update des donnees');
        $em = $this->registry->getManager();

        $data = $em->getRepository(HeProduct::class)->findAll();

        foreach($data as $item){
            $item->setUid(uniqid());
        }

        $em->flush();

        $io->newLine();
        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
