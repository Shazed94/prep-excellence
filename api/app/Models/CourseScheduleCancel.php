<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseScheduleCancel extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable=[
        'course_schedule_id', 'employee_id', 'reason','note','status', 'created_by', 'updated_by', 'ip', 'browser',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class,'created_by','id');
    }

    public function courseSchedule()
    {
        return $this->belongsTo(CourseSchedule::class);
    }
}
