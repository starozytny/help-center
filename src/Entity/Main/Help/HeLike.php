<?php

namespace App\Entity\Main\Help;

use App\Entity\Main\User;
use App\Repository\Main\Help\HeLikeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HeLikeRepository::class)]
class HeLike
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $type = null;

    #[ORM\Column]
    private ?int $identifiant = null;

    #[ORM\ManyToOne(inversedBy: 'heLikes')]
    private ?User $user = null;

    #[ORM\Column]
    private ?int $answer = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getIdentifiant(): ?int
    {
        return $this->identifiant;
    }

    public function setIdentifiant(int $identifiant): self
    {
        $this->identifiant = $identifiant;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getAnswer(): ?int
    {
        return $this->answer;
    }

    public function setAnswer(int $answer): self
    {
        $this->answer = $answer;

        return $this;
    }
}
