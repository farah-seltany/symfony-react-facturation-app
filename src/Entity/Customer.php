<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 *     normalizationContext={
 *      "groups"={"customers_read"}
 *     },
 *     collectionOperations={"GET", "POST"},
 *     itemOperations={"GET", "PUT", "DELETE"},
 *     subresourceOperations={
 *          "in_voices_get_subresource"={"path"="/customers/{id}/invoices"}
 *     },
 *     attributes={
 *          "pagination_enabled"=true,
 *          "pagination_items_per_page"=10
 *     },
 * )
 * @ApiFilter(SearchFilter::class, properties={"firstName":"partial", "lastName":"partial", "email":"partial", "company":"partial"})
 * @ApiFilter(OrderFilter::class)
 * @UniqueEntity("email", message="Un client avec cette adresse email existe déjà.")
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "invoices_read", "users_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read", "users_read"})
     * @Assert\Length(min="3", minMessage="Le prénom doit contenir entre 3 et 255 caractères.")
     * @Assert\Length(max="255", maxMessage="maximum length is 255")
     * @Assert\NotBlank(message="Le prénom est obligatoire.")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read", "users_read"})
     * @Assert\Length(min="3", minMessage="Le nom doit contenir entre 3 et 255 caractères.")
     * @Assert\Length(max="255", maxMessage="Le nom doit contenir entre 3 et 255 caractères.")
     * @Assert\NotBlank(message="Le nom est obligatoire.")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read", "users_read"})
     * @Assert\Email(message="L'adresse email n'est pas valide.")
     * @Assert\NotBlank(message="L'email est obligatoire.")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read", "invoices_read", "users_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=InVoice::class, mappedBy="customer")
     * @Groups({"customers_read", "users_read"})
     * @ApiSubresource()
     */
    private $inVoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customers_read"})
     * @Assert\NotBlank(message="User can not be null")
     */
    private $user;

    public function __construct()
    {
        $this->inVoices = new ArrayCollection();
    }

    /**
     * Permet de retourner le total des invoices
     * @Groups({"customers_read"})
     * @return float
     */

    public function getTotalAmount(): float
    {
        return array_reduce($this->inVoices->toArray(), function ($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * Permet de retourner le montant impayé
     * @Groups({"customers_read"})
     * @return float
     */

    public function getUnpaidAmount(): float
    {
        return array_reduce($this->inVoices->toArray(), function ($total, $invoice) {
            return $total + ($invoice->getStatus() === "PAID" || $invoice->getStatus() === "CANCELLED" ? 0 : $invoice->getAmount());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
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

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|InVoice[]
     */
    public function getInVoices(): Collection
    {
        return $this->inVoices;
    }

    public function addInVoice(InVoice $inVoice): self
    {
        if (!$this->inVoices->contains($inVoice)) {
            $this->inVoices[] = $inVoice;
            $inVoice->setCustomerId($this);
        }

        return $this;
    }

    public function removeInVoice(InVoice $inVoice): self
    {
        if ($this->inVoices->removeElement($inVoice)) {
            // set the owning side to null (unless already changed)
            if ($inVoice->getCustomerId() === $this) {
                $inVoice->setCustomerId(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
