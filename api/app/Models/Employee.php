<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'employee_id',
        'designation_id',
        'father_name',
        'mother_name',
        'nid',
        'marital_status_id',
        'emergency_contact',
        'present_address',
        'permanent_address',
        'join_date',
        'hour_rate',
        'salary_monthly',
        'short_biography',
        'biography',
        'is_active',
        'created_by',
        'updated_by',
        'ip',
        'browser',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'designation_id' => 'integer',
        'marital_status_id' => 'integer',
        'hour_rate' => 'double',
        'salary_monthly' => 'double',
        //'join_date' => 'date',
        'is_active' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function userable()
    {
        return $this->morphOne(User::class,'userable');
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function maritalStatus()
    {
        return $this->belongsTo(MaritalStatus::class);
    }

    public function employeeQualifications()
    {
        return $this->hasMany(EmployeeQualification::class);
    }

    public function workExperiences()
    {
        return $this->hasMany(WorkExperience::class);
    }
    public function courseEmployees()
    {
        return $this->belongsToMany(Course::class,'course_employee')->withTimestamps();
    }

    public function employeeScheudles()
    {
        return $this->hasMany(CourseSchedule::class);
    }

    public function employeeOverTimes()
    {
        return $this->hasMany(EmployeeOverTime::class);
    }
    public function employeeWorkings()
    {
        return $this->hasMany(EmployeeWorking::class);
    }
    public function employeePayments()
    {
        return $this->hasMany(EmployeePayment::class);
    }

    public function employeeSubjectSalaries()
    {
        return $this->hasMany(EmployeeSubjectSalary::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class);
    }
}
