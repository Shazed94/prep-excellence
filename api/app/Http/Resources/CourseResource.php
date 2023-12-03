<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
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
            'course_type_id' => $this->course_type_id,
            'course_type' => $this->course_type,
            'name' => $this->name,
            'batch' => $this->batch,
            'amount' => $this->amount,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'duration_in_hour' => $this->duration_in_hour,
            'duration_in_week' => $this->duration_in_week,
            'course_location' => $this->course_location,
            'class_time' => $this->class_time,
            'course_outline' => $this->course_outline,
            'position' => $this->position,
            'is_active' => $this->is_active,
            'image' => $this->image,
            'level' => $this->level,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'updatedBy' => new UserResource($this->whenLoaded('updatedBy')),
            'courseType' => new CourseTypeResource($this->whenLoaded('courseType')),
            'courseCategories' => CourseCategoryResource::collection($this->whenLoaded('courseCategories')),
            'studentCourses' => StudentCourseResource::collection($this->whenLoaded('studentCourses')),
            'courseSchedules' => CourseScheduleResource::collection($this->whenLoaded('courseSchedules')),
            'attendanceStudents' => AttendanceStudentResource::collection($this->whenLoaded('attendanceStudents')),
            'employees' => EmployeeResource::collection($this->whenLoaded('employees')),
            'students' => StudentResource::collection($this->whenLoaded('students')),
        ];
    }
}
