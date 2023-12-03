<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuestionBankResource extends JsonResource
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
            'course_id' => $this->course_id,
            'course_type_id' => $this->course_type_id,
            'employee_id' => $this->employee_id,
            'question_type' => $this->question_type,
            'question' => $this->question,
            'options' => $this->options,
            'answer' => $this->answer,
            'mark' => $this->mark,
        ];
    }
}
