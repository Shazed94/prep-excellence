<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentAnswerResource extends JsonResource
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
            'student_id' => $this->student_id,
            'exam_id' => $this->exam_id,
            'exam_question_id' => $this->exam_question_id,
            'student_answer' => $this->student_answer,
            'correct_answer' => $this->correct_answer,
            'total_mark' => $this->total_mark,
            'mark' => $this->mark,
        ];
    }
}
