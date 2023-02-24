<?php

namespace App\Service\Data;

use App\Entity\Main\Agenda\AgEvent;
use App\Entity\Main\Changelog;
use App\Entity\Main\Contact;
use App\Entity\Main\Notification;
use App\Entity\Main\Settings;
use App\Entity\Main\Society;
use App\Entity\Main\User;
use App\Service\SanitizeData;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

class DataMain
{
    public function __construct(
        private readonly SanitizeData $sanitizeData,
        private readonly ManagerRegistry $registry
    ) {}

    public function setDataUser(User $obj, $data): User
    {
        if (isset($data->roles)) $obj->setRoles($data->roles);

        return ($obj)
            ->setUsername($this->sanitizeData->fullSanitize($data->username))
            ->setFirstname($this->sanitizeData->sanitizeString($data->firstname))
            ->setLastname($this->sanitizeData->sanitizeString($data->lastname))
            ->setEmail($data->email)
        ;
    }

    public function setDataSociety(Society $obj, $data, Settings $settings): Society
    {
        $prefix = $settings->isMultipleDatabase() ? $settings->getPrefixDatabase() : "default";

        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setCode($this->sanitizeData->trimData($data->code))
            ->setManager($prefix . $this->sanitizeData->trimData($data->code))
        ;
    }

    public function setDataChangelog(Changelog $obj, $data): Changelog
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setType((int) $data->type)
            ->setContent($this->sanitizeData->trimData($data->content->html))
        ;
    }

    public function setDataContact(Contact $obj, $data): Contact
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setEmail($this->sanitizeData->trimData($data->email))
            ->setMessage($this->sanitizeData->trimData($data->message))
        ;
    }

    public function createDataNotification($name, $icon, User|UserInterface $user, $url = null): void
    {
        $obj = (new Notification())
            ->setName($this->sanitizeData->trimData($name))
            ->setIcon($this->sanitizeData->trimData($icon))
            ->setUrl($this->sanitizeData->trimData($url))
            ->setUser($user)
        ;

        $em = $this->registry->getManager();

        $em->persist($obj);
        $em->flush();
    }

    public function setDataAgEvent(AgEvent $obj, $data): AgEvent
    {
        if($data->allDay[0] === 1){
            $obj->setStartAt($this->sanitizeData->createDatePicker($data->startAt));
        }else{
            $startTime = str_replace('h', ':', $data->startTime);
            $endTime   = str_replace('h', ':', $data->endTime);
            $obj->setStartAt($this->sanitizeData->createDateTimePicker($data->startAt . " " . $startTime));
            $obj->setEndAt($data->endAt ? $this->sanitizeData->createDateTimePicker($data->endAt . " " . $endTime) : null);
        }

        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setType((int) $data->type)
            ->setContent($this->sanitizeData->trimData($data->content->html))
            ->setLocalisation($this->sanitizeData->trimData($data->localisation))
            ->setAllDay($data->allDay[0])
        ;
    }
}
