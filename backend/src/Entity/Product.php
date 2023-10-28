<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $trailer = null;

    #[ORM\Column(length: 255)]
    private ?string $dev = null;

    #[ORM\Column(length: 255)]
    private ?string $editor = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $release = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\ManyToMany(targetEntity: Category::class, inversedBy: 'products')]
    private Collection $category;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Edition::class)]
    private Collection $edition;

    #[ORM\ManyToMany(targetEntity: Genre::class, inversedBy: 'products')]
    private Collection $genre;

    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'products')]
    private Collection $tag;

    #[ORM\ManyToMany(targetEntity: Platform::class, inversedBy: 'products')]
    private Collection $platform;

    public function __construct()
    {
        $this->category = new ArrayCollection();
        $this->edition = new ArrayCollection();
        $this->genre = new ArrayCollection();
        $this->tag = new ArrayCollection();
        $this->platform = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getTrailer(): ?string
    {
        return $this->trailer;
    }

    public function setTrailer(?string $trailer): static
    {
        $this->trailer = $trailer;

        return $this;
    }

    public function getDev(): ?string
    {
        return $this->dev;
    }

    public function setDev(string $dev): static
    {
        $this->dev = $dev;

        return $this;
    }

    public function getEditor(): ?string
    {
        return $this->editor;
    }

    public function setEditor(string $editor): static
    {
        $this->editor = $editor;

        return $this;
    }

    public function getRelease(): ?\DateTimeInterface
    {
        return $this->release;
    }

    public function setRelease(?\DateTimeInterface $release): static
    {
        $this->release = $release;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getCategory(): Collection
    {
        return $this->category;
    }

    public function addCategory(Category $category): static
    {
        if (!$this->category->contains($category)) {
            $this->category->add($category);
        }

        return $this;
    }

    public function removeCategory(Category $category): static
    {
        $this->category->removeElement($category);

        return $this;
    }

    /**
     * @return Collection<int, Edition>
     */
    public function getEdition(): Collection
    {
        return $this->edition;
    }

    public function addEdition(Edition $edition): static
    {
        if (!$this->edition->contains($edition)) {
            $this->edition->add($edition);
            $edition->setProduct($this);
        }

        return $this;
    }

    public function removeEdition(Edition $edition): static
    {
        if ($this->edition->removeElement($edition)) {
            // set the owning side to null (unless already changed)
            if ($edition->getProduct() === $this) {
                $edition->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Genre>
     */
    public function getGenre(): Collection
    {
        return $this->genre;
    }

    public function addGenre(Genre $genre): static
    {
        if (!$this->genre->contains($genre)) {
            $this->genre->add($genre);
        }

        return $this;
    }

    public function removeGenre(Genre $genre): static
    {
        $this->genre->removeElement($genre);

        return $this;
    }

    /**
     * @return Collection<int, Tag>
     */
    public function getTag(): Collection
    {
        return $this->tag;
    }

    public function addTag(Tag $tag): static
    {
        if (!$this->tag->contains($tag)) {
            $this->tag->add($tag);
        }

        return $this;
    }

    public function removeTag(Tag $tag): static
    {
        $this->tag->removeElement($tag);

        return $this;
    }

    /**
     * @return Collection<int, Platform>
     */
    public function getPlatform(): Collection
    {
        return $this->platform;
    }

    public function addPlatform(Platform $platform): static
    {
        if (!$this->platform->contains($platform)) {
            $this->platform->add($platform);
        }

        return $this;
    }

    public function removePlatform(Platform $platform): static
    {
        $this->platform->removeElement($platform);

        return $this;
    }
}
