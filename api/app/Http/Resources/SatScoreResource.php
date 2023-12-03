<?php

namespace App\Http\Resources;

use App\Models\SatSection;
use Illuminate\Http\Resources\Json\JsonResource;

class SatScoreResource extends JsonResource
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
            'sat_section_id' => $this->sat_section_id,
            'raw_score' => $this->raw_score,
            'reading' => $this->reading,
            'writing' => $this->writing,
            'math' => $this->math,
            'satSection'=> new SatSectionResource($this->whenLoaded('satSection')),
        ];
    }
}
