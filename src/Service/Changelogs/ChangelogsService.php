<?php

namespace App\Service\Changelogs;

use App\Entity\Main\Help\HeChangelog;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

class ChangelogsService
{
    public function __construct(private readonly string $privateDirectory, private readonly Environment $twig)
    {}

    /**
     * @throws SyntaxError
     * @throws RuntimeError
     * @throws LoaderError
     */
    public function createFile(HeChangelog $obj): array
    {
//        $lastData = $repository->findLastTenBeforeNumero($obj->getNumero());

        $html = $this->twig->render('user/generate/changelogs/gerance.html.twig', [
            'obj' => $obj,
            'lastData' => [$obj]
        ]);

        $filename = $obj->getFilename() ?: $obj->getNumero() . "_" . ($obj->isPatch() ? "PATCH_" . $obj->getNumPatch() : "VERSION_" . $obj->getNumVersion()) . '.html';
        $pathFile = $this->privateDirectory . HeChangelog::FOLDER_GENERATED . "/" . $filename;

        file_put_contents($pathFile, $html);

        $obj->setFilename($filename);

        return [$filename, $pathFile];
    }
}





















