<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SliderResource extends JsonResource
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
            'position' => $this->position,
            'text_1' => $this->text_1,
            'text_2' => $this->text_2,
            'button_1_text' => $this->button_1_text,
            'button_1_url' => $this->button_1_url,
            'button_2_text' => $this->button_2_text,
            'button_2_url' => $this->button_2_url,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'slider_type' => $this->slider_type,
            'image' => $this->image,
            'video' => $this->video,
            'slider_script' => $this->slider_script,
        ];
    }
}
