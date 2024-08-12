<?php

namespace App\Entity\Main\Help;

use App\Entity\DataEntity;
use App\Entity\Enum\Help\HelpStatut;
use App\Entity\Enum\Help\HelpVisibility;
use App\Entity\Main\User;
use App\Repository\Main\Help\HeDocumentationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HeDocumentationRepository::class)]
class HeDocumentation extends DataEntity
{
    const FOLDER = "images/editor/documentations";

    const FORM = ['doc_form'];
    const READ = ['doc_read'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['doc_form', 'doc_read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['doc_form'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['doc_read'])]
    private ?string $slug = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['doc_form'])]
    private ?string $content = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['doc_form'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['doc_form'])]
    private ?int $status = HelpStatut::Draft;

    #[ORM\Column]
    #[Groups(['doc_form'])]
    private ?int $visibility = HelpVisibility::All;

    #[ORM\ManyToOne(inversedBy: 'documentations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    #[ORM\ManyToOne(inversedBy: 'documentations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?HeProduct $product = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['doc_form'])]
    private ?string $icon = null;

    #[ORM\Column]
    #[Groups(['doc_form'])]
    private ?bool $isTwig = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['doc_form'])]
    private ?string $twigName = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getVisibility(): ?int
    {
        return $this->visibility;
    }

    public function setVisibility(int $visibility): self
    {
        $this->visibility = $visibility;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getProduct(): ?HeProduct
    {
        return $this->product;
    }

    public function setProduct(?HeProduct $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getIcon(): ?string
    {
        if(!$this->icon){
            return 'book';
        }
        return $this->icon;
    }

    public function setIcon(?string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function isTwig(): ?bool
    {
        return $this->isTwig;
    }

    public function setTwig(bool $isTwig): static
    {
        $this->isTwig = $isTwig;

        return $this;
    }

    public function getTwigName(): ?string
    {
        return $this->twigName;
    }

    public function setTwigName(?string $twigName): static
    {
        $this->twigName = $twigName;

        return $this;
    }
}
