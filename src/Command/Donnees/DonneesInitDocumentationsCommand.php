<?php

namespace App\Command\Donnees;

use App\Entity\Enum\Help\HelpType;
use App\Entity\Main\Help\HeDocumentation;
use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\User;
use App\Service\Data\DataHelp;
use App\Service\DatabaseService;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'donnees:init:documentations',
    description: 'Init data documentations',
)]
class DonneesInitDocumentationsCommand extends Command
{
    private ObjectManager $em;
    private DataHelp $dataMain;

    public function __construct(DatabaseService $databaseService, DataHelp $dataMain)
    {
        parent::__construct();

        $this->em = $databaseService->getDefaultManager();
        $this->dataMain = $dataMain;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Initialisation des données des documentations');

        if(count($this->em->getRepository(HeDocumentation::class)->findAll()) != 0){
            $io->error('Les documentations sont déjà initialisés.');
            return Command::FAILURE;
        }

        $product = $this->em->getRepository(HeProduct::class)->findOneBy(['name' => 'Lotys']);
        if(!$product){
            $io->error('Veuillez lancer l\'initialisation des produits avec Lotys.');
            return Command::FAILURE;
        }

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'shanbo']);
        if(!$user){
            $io->error('Veuillez lancer l\'initialisation des utilisateurs avec shanbo.');
            return Command::FAILURE;
        }

        $data =  [
            [
                'icon' => "check1",
                'name' => "Le statut des biens",
                'description' => ['value' => '', 'html' => '
                    Expliquons la signification des symboles
                    <div class="badges-custom">
                        <span class="badge-custom-lotys">
                            <span class="icon-check1"></span>
                        </span>
                        <span class="badge-custom-lotys" style="color: var(--danger); background-color: var(--dangerOpacity4)">
                            <span class="icon-warning1"></span>
                        </span>
                        <span class="badge-custom-lotys" style="color: var(--txt); background-color: var(--grey0Opacity4)">
                            <span class="icon-pause"></span>
                        </span>
                    </div>'],
                'content' => ['value' => '', 'html' => 'Les status'],
                'duration' => null
            ],
        ];

        foreach($data as $obj){
            $obj = $this->dataMain->setDataDocumentation(new HeDocumentation(), json_decode(json_encode($obj)));
            $obj->setAuthor($user);
            $obj->setProduct($product);

            $this->em->persist($obj);
        }
        $io->text('Documentations : Initialisation terminée.' );
        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
