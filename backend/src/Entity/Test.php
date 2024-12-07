<?php

namespace App\Entity;

use App\Repository\TestRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TestRepository::class)]
class Test
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $comment = null;

    #[ORM\Column(nullable: true)]
    private ?int $rate = null;

    #[ORM\ManyToOne(inversedBy: 'tests')]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'tests')]
    private ?User $user = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToMany(mappedBy: 'test', targetEntity: Vote::class, cascade: ['persist', 'remove'])]
    private Collection $vote;

    #[ORM\OneToMany(mappedBy: 'test', targetEntity: Point::class, cascade: ['persist', 'remove'])]
    private Collection $points;

    public function __construct()
    {
        $this->vote = new ArrayCollection();
        $this->points = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    public function getRate(): ?int
    {
        return $this->rate;
    }

    public function setRate(?int $rate): static
    {
        $this->rate = $rate;

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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection<int, Vote>
     */
    public function getVote(): Collection
    {
        return $this->vote;
    }

    public function addVote(Vote $vote): static
    {
        if (!$this->vote->contains($vote)) {
            $this->vote->add($vote);
            $vote->setTest($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): static
    {
        if ($this->vote->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getTest() === $this) {
                $vote->setTest(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Point>
     */
    public function getPoints(): Collection
    {
        return $this->points;
    }

    public function addPoint(Point $point): static
    {
        if (!$this->points->contains($point)) {
            $this->points->add($point);
            $point->setTest($this);
        }

        return $this;
    }

    public function removePoint(Point $point): static
    {
        if ($this->points->removeElement($point)) {
            // set the owning side to null (unless already changed)
            if ($point->getTest() === $this) {
                $point->setTest(null);
            }
        }

        return $this;
    }

    public function getPositiveVotesCount(): int
    {
        return $this->getVote()->filter(function($vote) {
            return $vote->isVote() === true;
        })->count();
    }

    public function getNegativeVotesCount(): int
    {
        return $this->getVote()->filter(function($vote) {
            return $vote->isVote() === false;
        })->count();
    }
}
