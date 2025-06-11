<?php

namespace App\Service\Changelogs;

use App\Entity\Main\Help\HeChangelog;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class ChangelogsService
{
    public function __construct(private readonly string $publicDirectory, private readonly Environment $twig)
    {}

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    public function createHtml(HeChangelog $obj, array $data): string
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

        return $this->twig->render('user/generate/changelogs/changelog.html.twig', [
            'logoUrl' => $logoUrl,
            'obj' => $obj,
            'lastData' => $data
        ]);
    }
}





















