<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
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
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'image' => $this->image,
            'bread_crumb_image' => $this->bread_crumb_image,
            'template' => $this->template,
            'service_title' => $this->service_title,
            'service_sub_title' => $this->service_sub_title,
            'services' => $this->services,
            'position' => $this->position,
            'status' => $this->status,
        ];
    }
}
