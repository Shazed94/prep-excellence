<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeSubjectSalary extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable=[
        'employee_id', 'course_type_id', 'course_category_id', 'hour_rate',
        'previous_hour_rate', 'is_active', 'created_by', 'updated_by', 'ip', 'browser',
    ];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'employee_id' => 'integer',
        'course_type_id' => 'integer',
        'course_category_id' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
        'is_active' => 'boolean',
    ];
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function courseType()
    {
        return $this->belongsTo(CourseType::class);
    }

    public function courseCategory()
    {
        return $this->belongsTo(CourseCategory::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class,'created_by','id');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class,'updated_by','id');
    }

}
