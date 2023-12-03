<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class HomeSectionResource extends JsonResource
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
            'section_design_type_id' => $this->section_design_type_id,
            'section_name' => $this->section_name,
            'section_name_is_show' => $this->section_name_is_show,
            'bg_type' => $this->bg_type,
            'bg_image' => $this->bg_image,
            'bg_color' => $this->bg_color,
            'col' => $this->col,
            'row' => $this->row,
            'title' => $this->title,
            'sub_title' => $this->sub_title,
            'text_align' => $this->text_align,
            'type' => $this->type,
            'image' => $this->image,
            'video' => $this->video,
            'video_script' => $this->video_script,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'button_name' => $this->button_name,
            'button_url' => $this->button_url,
            'position' => $this->position,
            'status' => $this->status,
        ];
    }
}
