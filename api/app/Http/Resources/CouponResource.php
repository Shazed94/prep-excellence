<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
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
            'title' => $this->title,
            'type' => $this->type,
            'code' => $this->code,
            'limit' => $this->limit,
            'used' => $this->used,
            'discount' => $this->discount,
            'expiry_date' => $this->expiry_date,
            'minimum_spend' => $this->minimum_spend,
            'maximum_spend' => $this->maximum_spend,
            'user_id' => $this->user_id,
            'status' => $this->status,
        ];
    }
}
