<?php

namespace App\Entity\Main\Help;

use App\Entity\DataEntity;
use App\Entity\Enum\Help\HelpType;
use App\Repository\Main\Help\HeProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HeProductRepository::class)]
class HeProduct extends DataEntity
{
    const FOLDER_LOGO = "logos";
    const FOLDER = "images/editor/products";

    const ACCESS = ['product_access'];
    const FORM = ['product_form'];
    const READ = ['product_read'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['product_access', 'product_form', 'product_read', 'changelog_settings'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['product_form'])]
    private ?string $uid = null;

    #[ORM\Column(length: 255)]
    #[Groups(['product_access', 'product_form'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['product_form'])]
    private ?int $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['product_form'])]
    private ?string $url = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['product_form'])]
    private ?string $starter = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['product_form'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['product_read'])]
    private ?string $slug = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $logo = null;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: HeDocumentation::class)]
    private Collection $documentations;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: HeTutorial::class)]
    private Collection $tutorials;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: HeCategory::class)]
    private Collection $categories;

    #[ORM\Column]
    #[Groups(['product_form'])]
    private ?bool $isIntern = null;

    /**
     * @var Collection<int, HeChangelog>
     */
    #[ORM\OneToMany(mappedBy: 'product', targetEntity: HeChangelog::class)]
    private Collection $changelogs;

    #[ORM\Column]
    #[Groups(['changelog_settings'])]
    private ?int $numeroChangelogVersion = 0;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['changelog_settings'])]
    private ?string $folderChangelog = null;

    public function __construct()
    {
        $this->documentations = new ArrayCollection();
        $this->tutorials = new ArrayCollection();
        $this->categories = new ArrayCollection();
        $this->changelogs = new ArrayCollection();
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

    public function getStarter(): ?string
    {
        return $this->starter;
    }

    public function setStarter(?string $starter): self
    {
        $this->starter = $starter;

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

    #[Groups(['product_form'])]
    public function getLogoFile()
    {
        return $this->getFileOrDefault($this->logo, self::FOLDER_LOGO);
    }

    public function isWebservice(): bool
    {
        return $this->getType() == HelpType::Web;
    }

    public function getTypeString(): string
    {
        return match($this->getType()) {
            HelpType::Web => "logiciel en ligne",
            HelpType::Windev => "logiciel",
            HelpType::Application => "application",
            HelpType::Website => "site en ligne",
            HelpType::Autre => "solution informatique",
        };
    }

    /**
     * @return Collection<int, HeDocumentation>
     */
    public function getDocumentations(): Collection
    {
        return $this->documentations;
    }

    public function addDocumentation(HeDocumentation $documentation): self
    {
        if (!$this->documentations->contains($documentation)) {
            $this->documentations->add($documentation);
            $documentation->setProduct($this);
        }

        return $this;
    }

    public function removeDocumentation(HeDocumentation $documentation): self
    {
        if ($this->documentations->removeElement($documentation)) {
            // set the owning side to null (unless already changed)
            if ($documentation->getProduct() === $this) {
                $documentation->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, HeTutorial>
     */
    public function getTutorials(): Collection
    {
        return $this->tutorials;
    }

    public function addTutorial(HeTutorial $tutorial): self
    {
        if (!$this->tutorials->contains($tutorial)) {
            $this->tutorials->add($tutorial);
            $tutorial->setProduct($this);
        }

        return $this;
    }

    public function removeTutorial(HeTutorial $tutorial): self
    {
        if ($this->tutorials->removeElement($tutorial)) {
            // set the owning side to null (unless already changed)
            if ($tutorial->getProduct() === $this) {
                $tutorial->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, HeCategory>
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(HeCategory $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
            $category->setProduct($this);
        }

        return $this;
    }

    public function removeCategory(HeCategory $category): self
    {
        if ($this->categories->removeElement($category)) {
            // set the owning side to null (unless already changed)
            if ($category->getProduct() === $this) {
                $category->setProduct(null);
            }
        }

        return $this;
    }

    public function isIntern(): ?bool
    {
        return $this->isIntern;
    }

    public function setIntern(bool $isIntern): static
    {
        $this->isIntern = $isIntern;

        return $this;
    }

    public function getDirname(): array|bool|string|null
    {
        return mb_strtolower($this->slug);
    }

    /**
     * @return Collection<int, HeChangelog>
     */
    public function getChangelogs(): Collection
    {
        return $this->changelogs;
    }

    public function addChangelog(HeChangelog $changelog): static
    {
        if (!$this->changelogs->contains($changelog)) {
            $this->changelogs->add($changelog);
            $changelog->setProduct($this);
        }

        return $this;
    }

    public function removeChangelog(HeChangelog $changelog): static
    {
        if ($this->changelogs->removeElement($changelog)) {
            // set the owning side to null (unless already changed)
            if ($changelog->getProduct() === $this) {
                $changelog->setProduct(null);
            }
        }

        return $this;
    }

    public function getNumeroChangelogVersion(): ?int
    {
        return $this->numeroChangelogVersion;
    }

    public function setNumeroChangelogVersion(int $numeroChangelogVersion): static
    {
        $this->numeroChangelogVersion = $numeroChangelogVersion;

        return $this;
    }

    public function getFolderChangelog(): ?string
    {
        return $this->folderChangelog;
    }

    public function setFolderChangelog(?string $folderChangelog): static
    {
        $this->folderChangelog = $folderChangelog;

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
