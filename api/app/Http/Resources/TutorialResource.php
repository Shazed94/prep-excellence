<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TutorialResource extends JsonResource
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
            'tutorial_category_id' => $this->tutorial_category_id,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'images' => $this->images,
            'position' => $this->position,
            'is_active' => $this->is_active,
            'tutorialCategory'=> new TutorialCategoryResource($this->whenLoaded('tutorialCategory')),
        ];
    }
}
