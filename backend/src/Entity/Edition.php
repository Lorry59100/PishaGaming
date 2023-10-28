<?php

namespace App\Entity;

use App\Repository\EditionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EditionRepository::class)]
class Edition
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $old_price = null;

    #[ORM\Column(nullable: true)]
    private ?int $price = null;

    #[ORM\Column(nullable: true)]
    private ?int $stock = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $img = null;

    #[ORM\ManyToOne(inversedBy: 'edition')]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'editions')]
    private ?EditionCategory $edition_category = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(?int $stock): static
    {
        $this->stock = $stock;

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

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

        return $this;
    }

    public function getEditionCategory(): ?EditionCategory
    {
        return $this->edition_category;
    }

    public function setEditionCategory(?EditionCategory $edition_category): static
    {
        $this->edition_category = $edition_category;

        return $this;
    }
}
