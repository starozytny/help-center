<?php

namespace App\Entity\Main\Help;

use App\Entity\DataEntity;
use App\Entity\Enum\Help\HelpStatut;
use App\Entity\Enum\Help\HelpVisibility;
use App\Entity\Main\User;
use App\Repository\Main\Help\HeTutorialRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HeTutorialRepository::class)]
class HeTutorial extends DataEntity
{
    const FOLDER = "images/editor/tutorials";

    const FORM = ['tuto_form'];
    const READ = ['tuto_read'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tuto_form', 'tuto_read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['tuto_form'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['tuto_read'])]
    private ?string $slug = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['tuto_form'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::TIME_MUTABLE, nullable: true)]
    #[Groups(['tuto_form'])]
    private ?\DateTimeInterface $duration = null;

    #[ORM\Column]
    private ?int $nbLike = 0;

    #[ORM\Column]
    private ?int $nbDislike = 0;

    #[ORM\Column]
    #[Groups(['tuto_form'])]
    private ?int $status = HelpStatut::Draft;

    #[ORM\Column]
    #[Groups(['tuto_form'])]
    private ?int $visibility = HelpVisibility::All;

    #[ORM\ManyToOne(inversedBy: 'tutorials')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    #[ORM\ManyToOne(inversedBy: 'tutorials')]
    #[ORM\JoinColumn(nullable: false)]
    private ?HeProduct $product = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'tutorial', targetEntity: HeStep::class)]
    private Collection $steps;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->steps = new ArrayCollection();
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

    public function getDuration(): ?\DateTimeInterface
    {
        return $this->duration;
    }

    public function setDuration(?\DateTimeInterface $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getNbLike(): ?int
    {
        return $this->nbLike;
    }

    public function setNbLike(int $nbLike): self
    {
        $this->nbLike = $nbLike;

        return $this;
    }

    public function getNbDislike(): ?int
    {
        return $this->nbDislike;
    }

    public function setNbDislike(int $nbDislike): self
    {
        $this->nbDislike = $nbDislike;

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

    /**
     * @return Collection<int, HeStep>
     */
    public function getSteps(): Collection
    {
        return $this->steps;
    }

    public function addStep(HeStep $step): self
    {
        if (!$this->steps->contains($step)) {
            $this->steps->add($step);
            $step->setTutorial($this);
        }

        return $this;
    }

    public function removeStep(HeStep $step): self
    {
        if ($this->steps->removeElement($step)) {
            // set the owning side to null (unless already changed)
            if ($step->getTutorial() === $this) {
                $step->setTutorial(null);
            }
        }

        return $this;
    }
}
