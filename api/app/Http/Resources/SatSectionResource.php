<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SatSectionResource extends JsonResource
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
            'description' => $this->description,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'satScores'=> SatScoreResource::collection($this->whenLoaded('satScores')),
        ];
    }
}
