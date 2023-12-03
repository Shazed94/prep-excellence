<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TutorialCategoryResource extends JsonResource
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
            'role_ids' => $this->role_ids,
            'description' => $this->description,
            'position' => $this->position,
            'is_active' => $this->is_active,
        ];
    }
}
