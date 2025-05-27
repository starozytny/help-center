<?php

namespace App\Entity\Enum\Image;

enum ImageType: int
{
    const Changelog = 0;
    const AgEvent = 1;
    const Mail = 2;
    const Tutorial = 3;
    const Documentation = 4;
    const Product = 5;
    const Question = 6;
    const HeChangelog = 7;
}
