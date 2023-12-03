<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
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
            'short_description' => $this->short_description,
            'description' => $this->description,
            'type' => $this->type,
            'image' => $this->image,
            'video' => $this->video,
            'embedded_code' => $this->embedded_code,
            'user_id' => $this->user_id,
            'category_id' => $this->category_id,
            'position' => $this->position,
            'status' => $this->status,
            'comment_count' => $this->comment_count,
            //'blogPreparedComments' => $this->blogPreparedComments,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'blogComments' => BlogCommentResource::collection($this->whenLoaded('blogComments')),
        ];
    }
}
