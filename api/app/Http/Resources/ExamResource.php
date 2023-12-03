<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
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
            'course_id' => $this->course_id,
            'time_type' => $this->time_type,
            'exam_start_date' => $this->exam_start_date,
            'exam_end_date' => $this->exam_end_date,
            'exam_start' => $this->exam_start,
            'exam_end' => $this->exam_end,
            'duration' => $this->duration,
            'exam_type' => $this->exam_type,
            'question_type' => $this->question_type,
            'sat_section_id' => $this->sat_section_id,
            'question' => $this->question,
            'employee_id' => $this->employee_id,
            'status' => $this->status,
            'student_answers_count' => $this->student_answers_count,
            'course' => new CourseResource($this->whenLoaded('course')),
            'employee' => new EmployeeResource($this->whenLoaded('employee')),
            'studentAnswers' => StudentAnswerResource::collection($this->whenLoaded('studentAnswers')),
            'satSection' => new SatSectionResource($this->whenLoaded('satSection')),
            'examQuestions' => ExamQuestionResource::collection($this->whenLoaded('examQuestions')),
        ];
    }
}
