<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttendanceStudent extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable=['student_id', 'employee_id', 'course_id', 'attendance_status_id', 'course_schedule_id', 'date'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function attendanceStatus()
    {
        return $this->belongsTo(AttendanceStatus::class);
    }
    public function courseSchedule()
    {
        return $this->belongsTo(CourseSchedule::class);
    }
}
