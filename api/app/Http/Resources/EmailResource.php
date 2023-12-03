<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmailResource extends JsonResource
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
            'name' => $this->name,
            'subject' => $this->subject,
            'email' => $this->email,
            'message' => $this->message,
            'file' => $this->file,
            'try' => $this->try,
            'is_sent' => $this->is_sent,
            'created_at' => $this->created_at,
        ];
    }
}
