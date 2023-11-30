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

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true, name: "`release`")]
    private ?\DateTimeInterface $release = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\ManyToMany(targetEntity: Genre::class, inversedBy: 'products')]
    private Collection $genre;

    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'products')]
    private Collection $tag;

    #[ORM\ManyToMany(targetEntity: Platform::class, inversedBy: 'products')]
    private Collection $platform;

    #[ORM\Column(nullable: true)]
    private ?int $old_price = null;

    #[ORM\Column(nullable: true)]
    private ?int $price = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $img = null;

    #[ORM\Column(nullable: true)]
    private ?int $stock = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    private ?Edition $edition = null;

    #[ORM\Column]
    private ?bool $isPhysical = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    private ?Category $category = null;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Test::class)]
    private Collection $tests;

    public function __construct()
    {
        $this->genre = new ArrayCollection();
        $this->tag = new ArrayCollection();
        $this->platform = new ArrayCollection();
        $this->tests = new ArrayCollection();
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

    public function getOldPrice(): ?int
    {
        return $this->old_price;
    }

    public function setOldPrice(?int $old_price): static
    {
        $this->old_price = $old_price;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getImg(): ?string
    {
        return $this->img;
    }

    public function setImg(?string $img): static
    {
        $this->img = $img;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(?int $stock): static
    {
        $this->stock = $stock;

        return $this;
    }

    public function getEdition(): ?Edition
    {
        return $this->edition;
    }

    public function setEdition(?Edition $edition): static
    {
        $this->edition = $edition;

        return $this;
    }

    public function isIsPhysical(): ?bool
    {
        return $this->isPhysical;
    }

    public function setIsPhysical(bool $isPhysical): static
    {
        $this->isPhysical = $isPhysical;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection<int, Test>
     */
    public function getTests(): Collection
    {
        return $this->tests;
    }

    public function addTest(Test $test): static
    {
        if (!$this->tests->contains($test)) {
            $this->tests->add($test);
            $test->setProduct($this);
        }

        return $this;
    }

    public function removeTest(Test $test): static
    {
        if ($this->tests->removeElement($test)) {
            // set the owning side to null (unless already changed)
            if ($test->getProduct() === $this) {
                $test->setProduct(null);
            }
        }

        return $this;
    }

}
