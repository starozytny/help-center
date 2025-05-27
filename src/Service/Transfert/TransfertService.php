<?php

namespace App\Service\Transfert;

class TransfertService
{
    public function __construct(private readonly string $ftpServer, private readonly string $ftpUsername, private readonly string $ftpPassword)
    {}

    public function sendToFTP($filename, $localFile): bool|string
    {
        try {
            $ftp = ftp_connect($this->ftpServer);
            if($ftp){
                ftp_login($ftp, $this->ftpUsername, $this->ftpPassword);
                ftp_pasv($ftp, true);

                $directoryFtp = "./gerance/INSTALL/NEW";

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
        }catch (\Exception $ex){
            return "Erreur avec le traitement FTP : " . $ex;
        }

        return true;
    }
}
