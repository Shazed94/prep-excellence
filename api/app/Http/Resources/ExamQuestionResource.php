<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamQuestionResource extends JsonResource
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
            'question_bank_id' => $this->question_bank_id,
            'exam_id' => $this->exam_id,
            'question_part' => $this->question_part,
            'question_type' => $this->question_type,
            'question' => $this->question,
            'options' => $this->options,
            'answer' => $this->answer,
            'mark' => $this->mark,
        ];
    }
}
