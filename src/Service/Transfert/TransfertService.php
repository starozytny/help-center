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

                if (!ftp_put($ftp, $filename, $localFile, FTP_BINARY)) {
                    return "Dépôt non autorisé par le FTP.";
                }

                ftp_close($ftp);
            }else{
                return "Connexion indisponible avec le FTP.";
            }
        }catch (\Exception $ex){
            return "Identification erronée avec le FTP.";
        }

        return true;
    }
}
