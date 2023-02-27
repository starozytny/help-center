<?php

namespace App\Service\Data;

use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeDocumentation;
use App\Entity\Main\Help\HeProduct;
use App\Entity\Main\Help\HeQuestion;
use App\Service\SanitizeData;

class DataHelp
{
    public function __construct(
        private readonly SanitizeData $sanitizeData,
    ) {}

    public function setDataProduct(HeProduct $obj, $data): HeProduct
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setType((int) $data->type)
            ->setSlug($this->sanitizeData->slugString($data->name))
            ->setUrl($this->sanitizeData->trimData($data->url))
            ->setDescription($this->sanitizeData->trimData($data->description))
        ;
    }

    public function setDataDocumentation(HeDocumentation $obj, $data): HeDocumentation
    {
        $duration = str_replace('h', ':', $data->duration);

        return ($obj)
            ->setIcon($this->sanitizeData->trimData($data->icon))
            ->setName($this->sanitizeData->trimData($data->name))
            ->setSlug($this->sanitizeData->slugString($data->name))
            ->setDuration($this->sanitizeData->createTimePicker($duration))
            ->setDescription($this->sanitizeData->trimData($data->description->html))
            ->setContent($this->sanitizeData->trimData($data->content->html))
        ;
    }

    public function setDataHeCategory(HeCategory $obj, $data): HeCategory
    {
        return ($obj)
            ->setRank((int) $data->rank)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setIcon($this->sanitizeData->trimData($data->icon))
            ->setSubtitle($this->sanitizeData->trimData($data->subtitle))
            ->setVisibility((int) $data->visibility)
        ;
    }

    public function setDataHeQuestion(HeQuestion $obj, $data): HeQuestion
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setContent($this->sanitizeData->trimData($data->content->html))
        ;
    }
}
