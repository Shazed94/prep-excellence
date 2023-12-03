<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PromotionResource extends JsonResource
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
            'position' => $this->position,
            'image' => $this->image,
            'title' => $this->title,
            'button_text' => $this->button_text,
            'button_url' => $this->button_url,
            'description' => $this->description,
        ];
    }
}
