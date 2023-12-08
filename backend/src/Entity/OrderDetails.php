<?php

namespace App\Entity;

use App\Repository\OrderDetailsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderDetailsRepository::class)]
class OrderDetails
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\ManyToOne(inversedBy: 'orderDetails')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Order $orders = null;

    #[ORM\ManyToOne(inversedBy: 'orderDetails')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $products = null;

    #[ORM\Column(length: 255)]
    private ?string $platform = null;

    #[ORM\Column]
    private ?int $price = null;

    #[ORM\OneToMany(mappedBy: 'orderDetails', targetEntity: ActivationKey::class)]
    private Collection $activation_keys;

    public function __construct()
    {
        $this->activation_keys = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getOrders(): ?Order
    {
        return $this->orders;
    }

    public function setOrders(?Order $orders): static
    {
        $this->orders = $orders;

        return $this;
    }

    public function getProducts(): ?Product
    {
        return $this->products;
    }

    public function setProducts(?Product $products): static
    {
        $this->products = $products;

        return $this;
    }

    public function getPlatform(): ?string
    {
        return $this->platform;
    }

    public function setPlatform(string $platform): static
    {
        $this->platform = $platform;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @return Collection<int, ActivationKey>
     */
    public function getActivationKeys(): Collection
    {
        return $this->activation_keys;
    }

    public function addActivationKey(ActivationKey $activationKey): static
    {
        if (!$this->activation_keys->contains($activationKey)) {
            $this->activation_keys->add($activationKey);
            $activationKey->setOrderDetails($this);
        }

        return $this;
    }

    public function removeActivationKey(ActivationKey $activationKey): static
    {
        if ($this->activation_keys->removeElement($activationKey)) {
            // set the owning side to null (unless already changed)
            if ($activationKey->getOrderDetails() === $this) {
                $activationKey->setOrderDetails(null);
            }
        }

        return $this;
    }
}
