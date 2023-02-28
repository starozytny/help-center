<?php

namespace App\Command\Donnees;

use App\Entity\Enum\Help\HelpType;
use App\Entity\Main\Help\HeProduct;
use App\Service\Data\DataHelp;
use App\Service\DatabaseService;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'donnees:init:products',
    description: 'Init data products',
)]
class DonneesInitProductsCommand extends Command
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

        $io->title('Initialisation des données des produits');

        if(count($this->em->getRepository(HeProduct::class)->findAll()) != 0){
            $io->error('Les produits sont déjà initialisés.');
            return Command::FAILURE;
        }

        $data =  [
            [
                'name' => "Lotys", 'type' => HelpType::Web, 'website' => 'lotys.fr', 'logo' => 'logo_lotys.svg',
                'description' => [
                    'html' => 'Webservice pour la gestion des transactions immobilières.<br /> Diffusez facilement vos annonces sur différentes plateformes !'
                ]
            ],
            [
                'name' => "Magesto", 'type' => HelpType::Web, 'website' => 'magesto.fr', 'logo' => 'logo_magesto.svg',
                'description' => [
                    'html' => 'Webservice pour la gestion des factures, devis et avoirs.<br /> Programmez vos contrats pour rapidement générer et envoyer vos documents !'
                ]
            ],
        ];

        foreach($data as $item){
            $obj = $this->dataMain->setDataProduct(new HeProduct(), json_decode(json_encode($item)));
            $obj->setLogo($item['logo']);

            $this->em->persist($obj);
        }
        $io->text('Produits : Initialisation terminée.' );
        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
