<?php

namespace App\Entity;

use App\Repository\VoteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VoteRepository::class)]
class Vote
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?bool $vote = null;

    #[ORM\ManyToOne(inversedBy: 'vote')]
    private ?Test $test = null;

    #[ORM\ManyToOne(inversedBy: 'votes')]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isVote(): ?bool
    {
        return $this->vote;
    }

    public function setVote(?bool $vote): static
    {
        $this->vote = $vote;

        return $this;
    }

    public function getTest(): ?Test
    {
        return $this->test;
    }

    public function setTest(?Test $test): static
    {
        $this->test = $test;

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
}
