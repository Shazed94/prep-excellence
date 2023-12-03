<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'fetcher' => $this->fetcher,
            'fetcher_position' => $this->fetcher_position,
            'type' => $this->type,
            'title' => $this->title,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'image' => $this->image,
            'galleries' => GalleryResource::collection($this->whenLoaded('galleries')),
            'blogs' => BlogResource::collection($this->whenLoaded('blogs')),
        ];
    }
}
