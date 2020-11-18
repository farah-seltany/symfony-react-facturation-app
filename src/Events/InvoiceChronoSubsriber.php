<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\InVoice;
use App\Repository\InVoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubsriber implements EventSubscriberInterface {

    private $security;
    private $repository;

    public function __construct(Security $security, InVoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        // TODO: Implement getSubscribedEvents() method.
        return [
            KernelEvents::VIEW => ['setInvoiceChrono', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setInvoiceChrono (ViewEvent $event) {

        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof InVoice && $method === 'POST') {
            //User connecté
            $user = $this->security->getUser();

            //Derniere facture chrono
            $lastChrono = $this->repository->findLastChrono($user);

            //Dernier chrono + 1
            $result->setChrono($lastChrono + 1);
            if (empty($result->getSentAt())) {
                $result->setSentAt(new \DateTime());
            }
        }
    }
}
