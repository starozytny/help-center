<?php

namespace App\Entity\Main\Help;

use App\Repository\Main\Help\HeChangelogRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HeChangelogRepository::class)]
class HeChangelog
{
    const FOLDER = "images/editor/changelogs";
    const FOLDER_GENERATED = "export/generated";

    const LIST = ['changelog_list'];
    const FORM = ['changelog_form'];
    const SETTINGS = ['changelog_settings'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?int $numero = null;

    #[ORM\Column(length: 255)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $name = null;

    #[ORM\Column(length: 50)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $numVersion = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['changelog_list'])]
    private ?string $filename = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $contentCreated = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $contentUpdated = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $contentFix = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['changelog_list'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['changelog_list'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'changelogs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?HeProduct $product = null;

    #[ORM\Column]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?\DateTime $dateAt = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $numPatch = null;

    #[ORM\Column]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?bool $isPatch = false;

    #[ORM\Column]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?bool $isDraft = true;

    #[ORM\Column(length: 255)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $uid = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumero(): ?int
    {
        return $this->numero;
    }

    public function setNumero(int $numero): static
    {
        $this->numero = $numero;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getNumVersion(): ?string
    {
        return $this->numVersion;
    }

    public function setNumVersion(string $numVersion): static
    {
        $this->numVersion = $numVersion;

        return $this;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(?string $filename): static
    {
        $this->filename = $filename;

        return $this;
    }

    public function getContentCreated(): ?string
    {
        return $this->contentCreated;
    }

    public function setContentCreated(?string $contentCreated): static
    {
        $this->contentCreated = $contentCreated;

        return $this;
    }

    public function getContentUpdated(): ?string
    {
        return $this->contentUpdated;
    }

    public function setContentUpdated(?string $contentUpdated): static
    {
        $this->contentUpdated = $contentUpdated;

        return $this;
    }

    public function getContentFix(): ?string
    {
        return $this->contentFix;
    }

    public function setContentFix(?string $contentFix): static
    {
        $this->contentFix = $contentFix;

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getProduct(): ?HeProduct
    {
        return $this->product;
    }

    public function setProduct(?HeProduct $product): static
    {
        $this->product = $product;

        return $this;
    }

    public function getDateAt(): ?\DateTime
    {
        return $this->dateAt;
    }

    public function setDateAt(\DateTime $dateAt): static
    {
        $this->dateAt = $dateAt;

        return $this;
    }

    public function getNumPatch(): ?string
    {
        return $this->numPatch;
    }

    public function setNumPatch(?string $numPatch): static
    {
        $this->numPatch = $numPatch;

        return $this;
    }

    public function isPatch(): ?bool
    {
        return $this->isPatch;
    }

    public function setIsPatch(bool $isPatch): static
    {
        $this->isPatch = $isPatch;

        return $this;
    }

    public function isDraft(): ?bool
    {
        return $this->isDraft;
    }

    public function setIsDraft(bool $isDraft): static
    {
        $this->isDraft = $isDraft;

        return $this;
    }

    public function getUid(): ?string
    {
        return $this->uid;
    }

    public function setUid(string $uid): static
    {
        $this->uid = $uid;

        return $this;
    }
}
