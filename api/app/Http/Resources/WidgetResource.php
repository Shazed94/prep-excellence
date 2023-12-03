<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WidgetResource extends JsonResource
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
            'placement' => $this->placement,
            'title' => $this->title,
            'type' => $this->type,
            'text' => $this->text,
            'p_menu_id' => $this->p_menu_id,
            'position' => $this->position,
            'status' => $this->status,
            'pMenu' => new PMenuResource($this->whenLoaded('pMenu')),
        ];
    }
}
