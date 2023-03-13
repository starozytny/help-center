<?php


namespace App\Twig;


use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class DurationExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('duration', [$this, 'formatDuration'])
        ];
    }

    public function formatDuration($arg1)
    {
        $duration = explode('h', $arg1);
        if($duration[0] == "00"){
            return (int) $duration[1] . 'min';
        }

        if($duration[1] == "00"){
            return (int) $duration[0] . 'h';
        }

        return $arg1;
    }
}
