<?php

namespace App\Entity\Main;

use App\Repository\Main\LogHistoryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LogHistoryRepository::class)]
class LogHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $who = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(length: 255)]
    private ?string $urlUsed = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWho(): ?string
    {
        return $this->who;
    }

    public function setWho(?string $who): static
    {
        $this->who = $who;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUrlUsed(): ?string
    {
        return $this->urlUsed;
    }

    public function setUrlUsed(string $urlUsed): static
    {
        $this->urlUsed = $urlUsed;

        return $this;
    }
}
