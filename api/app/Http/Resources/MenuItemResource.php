<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
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
            'p_menu_id' => $this->p_menu_id,
            'name' => $this->name,
            'url' => $this->url,
            'relation_id' => $this->relation_id,
            'relation_with' => $this->relation_with,
            'menu_item_id' => $this->menu_item_id,
            'position' => $this->position,
            'status' => $this->status,
        ];
    }
}
