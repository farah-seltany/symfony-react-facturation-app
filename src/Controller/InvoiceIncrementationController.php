<?php

namespace App\Controller;

use App\Entity\InVoice;

class InvoiceIncrementationController {


    public function __invoke(InVoice $data)
    {
        // TODO: Implement __invoke() method.

        dd($data);
    }
}
