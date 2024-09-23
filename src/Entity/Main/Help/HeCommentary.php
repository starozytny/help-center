<?php

namespace App\Entity\Main\Help;

use App\Entity\Main\User;
use App\Repository\Main\Help\HeCommentaryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HeCommentaryRepository::class)]
class HeCommentary
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'heCommentaries')]
    private ?User $user = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $message = null;

    #[ORM\ManyToOne(fetch: 'EAGER', inversedBy: 'commentaries')]
    private ?HeDocumentation $documentation = null;

    #[ORM\ManyToOne(fetch: 'EAGER', inversedBy: 'commentaries')]
    private ?HeTutorial $tutorial = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

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

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getDocumentation(): ?HeDocumentation
    {
        return $this->documentation;
    }

    public function setDocumentation(?HeDocumentation $documentation): static
    {
        $this->documentation = $documentation;

        return $this;
    }

    public function getTutorial(): ?HeTutorial
    {
        return $this->tutorial;
    }

    public function setTutorial(?HeTutorial $tutorial): static
    {
        $this->tutorial = $tutorial;

        return $this;
    }
}
