<?php

namespace App\Entity;

use App\Repository\ActivationKeyRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ActivationKeyRepository::class)]
class ActivationKey
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $activation_key = null;

    #[ORM\ManyToOne(inversedBy: 'activation_keys')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'activation_keys')]
    private ?OrderDetails $orderDetails = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getActivationKey(): ?string
    {
        return $this->activation_key;
    }

    public function setActivationKey(string $activation_key): static
    {
        $this->activation_key = $activation_key;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getOrderDetails(): ?OrderDetails
    {
        return $this->orderDetails;
    }

    public function setOrderDetails(?OrderDetails $orderDetails): static
    {
        $this->orderDetails = $orderDetails;

        return $this;
    }
}
