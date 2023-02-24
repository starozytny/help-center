<?php

namespace App\Entity\Main\Help;

use App\Entity\DataEntity;
use App\Entity\Enum\Help\HelpType;
use App\Repository\Main\Help\HeProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HeProductRepository::class)]
class HeProduct extends DataEntity
{
    const FOLDER = "logos";

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $url = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $logo = null;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: HeDocumentation::class)]
    private Collection $documentation;

    public function __construct()
    {
        $this->documentation = new ArrayCollection();
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

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(?string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

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

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): self
    {
        $this->logo = $logo;

        return $this;
    }

    public function getLogoFile()
    {
        return $this->getFileOrDefault($this->logo, self::FOLDER);
    }

    public function isWebservice(): bool
    {
        return $this->getType() == HelpType::Web;
    }

    /**
     * @return Collection<int, HeDocumentation>
     */
    public function getDocumentation(): Collection
    {
        return $this->documentation;
    }

    public function addDocumentation(HeDocumentation $documentation): self
    {
        if (!$this->documentation->contains($documentation)) {
            $this->documentation->add($documentation);
            $documentation->setProduct($this);
        }

        return $this;
    }

    public function removeDocumentation(HeDocumentation $documentation): self
    {
        if ($this->documentation->removeElement($documentation)) {
            // set the owning side to null (unless already changed)
            if ($documentation->getProduct() === $this) {
                $documentation->setProduct(null);
            }
        }

        return $this;
    }
}
