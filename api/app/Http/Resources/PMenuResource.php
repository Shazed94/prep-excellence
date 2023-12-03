<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PMenuResource extends JsonResource
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
            'status' => $this->status,
            'position' => $this->position,
            'menuItems' => MenuItemResource::collection($this->whenLoaded('menuItems')),
        ];
    }
}
