<?php

namespace App\Entity\Main;

use App\Entity\DataEntity;
use App\Entity\Main\Help\HeDocumentation;
use App\Entity\Main\Help\HeFavorite;
use App\Entity\Main\Help\HeLike;
use App\Entity\Main\Help\HeTutorial;
use App\Repository\Main\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User extends DataEntity implements UserInterface, PasswordAuthenticatedUserInterface
{
    const FOLDER = "avatars";

    const LIST = ['user_list'];
    const FORM = ['user_form'];
    const EXTERNAL_SELECT = ['user_ext_select'];

    const CODE_ROLE_USER = 0;
    const CODE_ROLE_DEVELOPER = 1;
    const CODE_ROLE_ADMIN = 2;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user_list', 'user_form', 'user_ext_select'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user_list', 'user_form', 'user_ext_select'])]
    private ?string $username = null;

    #[ORM\Column]
    #[Groups(['user_form'])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups(['user_form'])]
    private array $access = [];

    /**
     * @var ?string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_list', 'user_form'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_list', 'user_form', 'user_ext_select'])]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_list', 'user_form', 'user_ext_select'])]
    private ?string $firstname = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updatedAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user_list'])]
    private ?\DateTime $lastLoginAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lostCode = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $lostAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_list', 'user_ext_select'])]
    private ?string $token = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $avatar = null;

    #[ORM\Column(length: 40)]
    #[Groups(['user_list'])]
    private ?string $manager = "default";

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['user_list', 'user_form'])]
    private ?Society $society = null;

    #[ORM\Column]
    #[Groups(['user_list'])]
    private ?bool $blocked = false;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: HeDocumentation::class)]
    private Collection $documentations;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: HeTutorial::class)]
    private Collection $tutorials;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: HeFavorite::class)]
    private Collection $heFavorites;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: HeLike::class)]
    private Collection $heLikes;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Mail::class)]
    private Collection $mails;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->token = $this->initToken();
        $this->documentations = new ArrayCollection();
        $this->tutorials = new ArrayCollection();
        $this->heFavorites = new ArrayCollection();
        $this->heLikes = new ArrayCollection();
        $this->mails = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return $this->isBlocked() ? ['ROLE_BLOCKED'] : array_unique($roles);
    }

    #[Groups(['user_list'])]
    public function getHighRole(): string
    {
        $rolesSortedByImportance = ['ROLE_DEVELOPER', 'ROLE_ADMIN', 'ROLE_USER'];
        $rolesLabel = ['Développeur', 'Administrateur', 'Utilisateur'];
        $i = 0;
        foreach ($rolesSortedByImportance as $role)
        {
            if (in_array($role, $this->roles)) return $rolesLabel[$i];
            $i++;
        }

        return $this->isBlocked() ? "Bloqué" : "Utilisateur";
    }

    #[Groups(['user_list'])]
    public function getHighRoleCode(): int
    {
        return match ($this->getHighRole()) {
            'Développeur' => self::CODE_ROLE_DEVELOPER,
            'Administrateur' => self::CODE_ROLE_ADMIN,
            default => self::CODE_ROLE_USER,
        };
    }

    public function isAdmin(): bool
    {
        return $this->getHighRoleCode() == self::CODE_ROLE_DEVELOPER || $this->getHighRoleCode() == self::CODE_ROLE_ADMIN;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getAccess(): array
    {
        $access = $this->access;

        return array_unique($access);
    }

    public function setAccess(array $access): self
    {
        $this->access = $access;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getHiddenEmail(): string
    {
        $email = $this->getEmail();
        $at = strpos($email, "@");
        $domain = substr($email, $at, strlen($email));
        $firstLetter = substr($email, 0, 1);
        $etoiles = "";
        for($i=1 ; $i < $at ; $i++){
            $etoiles .= "*";
        }
        return $firstLetter . $etoiles . $domain;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTime $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getLastLoginAt(): ?\DateTime
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTime $lastLoginAt): self
    {
        $this->lastLoginAt = $lastLoginAt;

        return $this;
    }

    public function getLostCode(): ?string
    {
        return $this->lostCode;
    }

    public function setLostCode(?string $lostCode): self
    {
        $this->lostCode = $lostCode;

        return $this;
    }

    public function getLostAt(): ?\DateTime
    {
        return $this->lostAt;
    }

    public function setLostAt(?\DateTime $lostAt): self
    {
        $this->lostAt = $lostAt;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): self
    {
        $this->avatar = $avatar;

        return $this;
    }

    #[Groups(['user_list', 'user_form'])]
    public function getAvatarFile(): ?string
    {
        return $this->getFileOrDefault($this->avatar, self::FOLDER, null);
    }

    public function getManager(): ?string
    {
        return $this->manager;
    }

    public function setManager(string $manager): self
    {
        $this->manager = $manager;

        return $this;
    }

    public function getSociety(): ?Society
    {
        return $this->society;
    }

    public function setSociety(?Society $society): self
    {
        $this->society = $society;

        return $this;
    }

    public function isBlocked(): ?bool
    {
        return $this->blocked;
    }

    public function setBlocked(bool $blocked): self
    {
        $this->blocked = $blocked;

        return $this;
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
            $documentation->setAuthor($this);
        }

        return $this;
    }

    public function removeDocumentation(HeDocumentation $documentation): self
    {
        if ($this->documentations->removeElement($documentation)) {
            // set the owning side to null (unless already changed)
            if ($documentation->getAuthor() === $this) {
                $documentation->setAuthor(null);
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
            $tutorial->setAuthor($this);
        }

        return $this;
    }

    public function removeTutorial(HeTutorial $tutorial): self
    {
        if ($this->tutorials->removeElement($tutorial)) {
            // set the owning side to null (unless already changed)
            if ($tutorial->getAuthor() === $this) {
                $tutorial->setAuthor(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, HeFavorite>
     */
    public function getHeFavorites(): Collection
    {
        return $this->heFavorites;
    }

    public function addHeFavorite(HeFavorite $heFavorite): self
    {
        if (!$this->heFavorites->contains($heFavorite)) {
            $this->heFavorites->add($heFavorite);
            $heFavorite->setUser($this);
        }

        return $this;
    }

    public function removeHeFavorite(HeFavorite $heFavorite): self
    {
        if ($this->heFavorites->removeElement($heFavorite)) {
            // set the owning side to null (unless already changed)
            if ($heFavorite->getUser() === $this) {
                $heFavorite->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, HeLike>
     */
    public function getHeLikes(): Collection
    {
        return $this->heLikes;
    }

    public function addHeLike(HeLike $heLike): self
    {
        if (!$this->heLikes->contains($heLike)) {
            $this->heLikes->add($heLike);
            $heLike->setUser($this);
        }

        return $this;
    }

    public function removeHeLike(HeLike $heLike): self
    {
        if ($this->heLikes->removeElement($heLike)) {
            // set the owning side to null (unless already changed)
            if ($heLike->getUser() === $this) {
                $heLike->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Mail>
     */
    public function getMails(): Collection
    {
        return $this->mails;
    }

    public function addMail(Mail $mail): static
    {
        if (!$this->mails->contains($mail)) {
            $this->mails->add($mail);
            $mail->setUser($this);
        }

        return $this;
    }

    public function removeMail(Mail $mail): static
    {
        if ($this->mails->removeElement($mail)) {
            // set the owning side to null (unless already changed)
            if ($mail->getUser() === $this) {
                $mail->setUser(null);
            }
        }

        return $this;
    }
}
