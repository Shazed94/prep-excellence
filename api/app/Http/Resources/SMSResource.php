<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SMSResource extends JsonResource
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
            'msisdn' => $this->msisdn,
            'text' => $this->text,
            'csms_id' => $this->csms_id,
            'sms_type' => $this->sms_type,
            'status' => $this->status,
            'try' => $this->try,
            'is_sent' => $this->is_sent,
            'info' => $this->info,
        ];
    }
}
