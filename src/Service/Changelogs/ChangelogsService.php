<?php

namespace App\Service\Changelogs;

use App\Entity\Main\Help\HeChangelog;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class ChangelogsService
{
    public function __construct(private readonly string $publicDirectory, private readonly string $privateDirectory, private readonly Environment $twig)
    {}

    public function getFolderGenerated(HeChangelog $obj): string
    {
        return $this->privateDirectory . HeChangelog::FOLDER_GENERATED . "/" . $obj->getId() . "/";
    }

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    public function createFile(HeChangelog $obj): string
    {
        $logoPath = $obj->getProduct()->getLogoFile();

        $logoUrl = null;
        $logoFilePath = $this->publicDirectory . $logoPath;
        if(file_exists($this->publicDirectory . $logoPath)){
            $logoBase64 = base64_encode(file_get_contents($this->publicDirectory . $logoPath));

            // Obtenir le type MIME du fichier
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $logoFilePath);
            finfo_close($finfo);

            $logoUrl = 'data:' . $mimeType . ';base64,' . $logoBase64;
        }

        $html = $this->twig->render('user/generate/changelogs/changelog.html.twig', [
            'logoUrl' => $logoUrl,
            'obj' => $obj,
            'lastData' => [$obj]
        ]);

        $filename = $obj->getFilename() ?: $obj->getNumero() . "_" . ($obj->isPatch() ? "PATCH_" . $obj->getNumPatch() : "VERSION_" . $obj->getNumVersion()) . '.html';

        $folder = $this->getFolderGenerated($obj);

        if(!is_dir($folder)){
            mkdir($folder, 0777, true);
        }

        $pathFile = $folder . $filename;

        file_put_contents($pathFile, $html);

        $obj->setFilename($filename);

        return $filename;
    }
}





















