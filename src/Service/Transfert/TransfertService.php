<?php

namespace App\Service\Transfert;

use App\Entity\Main\Help\HeProduct;
use Exception;

class TransfertService
{
    public function __construct(private readonly string $ftpServer, private readonly string $ftpUsername, private readonly string $ftpPassword)
    {}

    /**
     * @throws Exception
     */
    public function sendToFTP(HeProduct $product, $filename, $localFile): bool|string
    {
        try {
            $ftp = ftp_connect($this->ftpServer);
            if($ftp){
                ftp_login($ftp, $this->ftpUsername, $this->ftpPassword);
                ftp_pasv($ftp, true);

                $directoryFtp = $product->getFolderChangelog();

                if(!ftp_nlist($ftp, $directoryFtp)){
                    return "Dossier introuvable sur le FTP.";
                }

                if(!ftp_nlist($ftp, $directoryFtp . "/OLD")){
                    ftp_mkdir($ftp, $directoryFtp . "/OLD");
                }

                $contents = ftp_nlist($ftp, $directoryFtp);
                foreach($contents as $contentFile){
                    if(str_contains($contentFile, '.html')){
                        ftp_rename($ftp, $contentFile, dirname($contentFile) . "/OLD/" . basename($contentFile));
                    }
                }

                if (!ftp_put($ftp, $directoryFtp . "/" . $filename, $localFile, FTP_BINARY)) {
                    return "Dépôt non autorisé par le FTP.";
                }

                ftp_close($ftp);
            }else{
                return "Connexion indisponible avec le FTP.";
            }
        }catch (Exception $ex){
            throw new Exception($ex);
        }

        return true;
    }
}
