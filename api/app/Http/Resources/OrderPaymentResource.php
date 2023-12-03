<?php

namespace App\Http\Resources;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderPaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'order_id' => $this->order_id,
            'amount' => $this->amount,
            'gateway_order_id' => $this->gateway_order_id,
            'refund_order_id' => $this->refund_order_id,
            'txn_number' => $this->txn_number,
            'receipt_url' => $this->receipt_url,
            'note' => $this->note,
        ];
    }
}
