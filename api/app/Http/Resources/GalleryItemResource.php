<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GalleryItemResource extends JsonResource
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
            'gallery_id' => $this->gallery_id,
            'type' => $this->type,
            'image' => $this->image,
            'video' => $this->video,
            'embedded_code' => $this->embedded_code,
            'position' => $this->position,
            'status' => $this->status,
        ];
    }
}
