<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InVoiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=InVoiceRepository::class)
 * @ApiResource(
 *     subresourceOperations={
 *          "api_customers_in_voices_get_subresource"={
 *              "normalization_context"={"groups"={"invoices_subresource"}}
 *          }
 *     },
 *     itemOperations={
            "GET", "PUT", "DELETE", "increment"={
 *              "method"="POST",
 *              "path"="/in_voices/{id}/increment",
 *              "controller"="App\Controller\InvoiceIncrementationController",
 *              "openapi_context"={
 *                  "summary"="Increase an invoice chrono",
 *                  "description"="Increase an invoice chrono"
 *              }
 *          }
 *     },
 *     attributes={
 *          "pagination_enabled"=true,
 *          "pagination_items_per_page"=20,
 *          "order": {"sent_at":"desc"}
 *     },
 *     normalizationContext={"groups"={"invoices_read"}},
 *     denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class)
 */
class InVoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "users_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "users_read", "invoices_subresource"})
     * @Assert\NotBlank(message="can not be null")
     * @Assert\Type(type="numeric", message="must be numeric")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "users_read", "invoices_subresource"})
     * @Assert\NotBlank(message="can not be null")
     * @Assert\Type("\DateTimeInterface", message="Sent at format is invalid")
     */
    private $sent_at;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "users_read", "invoices_subresource"})
     * @Assert\NotBlank(message="can not be null")
     * @Assert\Choice(choices={"SENT", "CANCELLED", "PAID"}, message="Status must be SENT, CANCELLED or PAID")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="inVoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="can not be null")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "users_read", "invoices_subresource"})
     * @Assert\NotBlank(message="can not be null")
     * @Assert\Type(type="integer", message="must be an integer")
     * @Assert\Positive(message="Chrono must be positive")
     */
    private $chrono;

    /**
     * Retourne le user a qui appartient la facture
     * @Groups({"invoices_read", "invoices_subresource"})
     * @return User
     */

    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sent_at;
    }

    public function setSentAt($sent_at): self
    {
        $this->sent_at = $sent_at;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
