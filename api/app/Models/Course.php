<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'course_type_id',
        'course_type',
        'name',
        'batch',
        'amount',
        'start_date',
        'end_date',
        'duration_in_hour',
        'duration_in_week',
        'course_location',
        'class_time',
        'course_outline',
        'position',
        'image',
        'level',
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
        'course_type_id' => 'integer',
        'course_type' => 'integer',
        'amount' => 'double',
        //'start_date' => 'date',
        //'end_date' => 'date',
        'duration_in_hour' => 'double',
        'is_active' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];
    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') . $image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
    }

    public function employees()
    {
        return $this->belongsToMany(Employee::class);
    }

    public function courseType()
    {
        return $this->belongsTo(CourseType::class);
    }

    public function courseSchedules()
    {
        return $this->hasMany(CourseSchedule::class);
    }

    public function attendanceStudents()
    {
        return $this->hasMany(AttendanceStudent::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class,'student_courses')->withTimestamps();
    }

    public function studentCourses()
    {
        return $this->hasMany(StudentCourse::class);
    }

    public function courseCategories()
    {
        return $this->belongsToMany(CourseCategory::class);
    }

    public function homeWorks()
    {
        return $this->hasMany(HomeWork::class);
    }
    public function courseMaterials()
    {
        return $this->hasMany(CourseMaterial::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class,'updated_by','id');
    }
}
