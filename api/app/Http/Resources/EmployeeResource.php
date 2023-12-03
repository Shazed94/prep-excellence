<?php

namespace App\Http\Resources;

use App\Models\EmployeePayment;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
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
            'employee_id' => $this->employee_id,
            'designation_id' => $this->designation_id,
            'father_name' => $this->father_name,
            'mother_name' => $this->mother_name,
            'nid' => $this->nid,
            'marital_status_id' => $this->marital_status_id,
            'emergency_contact' => $this->emergency_contact,
            'present_address' => $this->present_address,
            'permanent_address' => $this->permanent_address,
            'join_date' => $this->join_date,
            'hour_rate' => $this->hour_rate,
            'salary_monthly' => $this->salary_monthly,
            'short_biography' => $this->short_biography,
            'biography' => $this->biography,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'userable' =>new UserResource($this->whenLoaded('userable')),
            'designation' => new DesignationResource($this->whenLoaded('designation')),
            'maritalStatus' =>new MaritalStatusResource($this->whenLoaded('maritalStatus')),
            'employeeQualifications' => EmployeeQualificationResource::collection($this->whenLoaded('employeeQualifications')),
            'workExperiences' => WorkExperienceResource::collection($this->whenLoaded('workExperiences')),
            'employeeSubjectSalaries' => EmployeeSubjectSalaryResource::collection($this->whenLoaded('employeeSubjectSalaries')),
            'employeeOverTimes' => EmployeeOverTimeResource::collection($this->whenLoaded('employeeOverTimes')),
            'employeeWorkings' => EmployeeWorkingResource::collection($this->whenLoaded('employeeWorkings')),
            'employeePayments' => EmployeePaymentResource::collection($this->whenLoaded('employeePayments')),
        ];
    }
}
