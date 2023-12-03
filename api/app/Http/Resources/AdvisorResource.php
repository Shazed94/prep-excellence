<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdvisorResource extends JsonResource
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
            'image' => $this->image,
            'designation' => $this->designation,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'is_active' => $this->is_active,
        ];
    }
}
