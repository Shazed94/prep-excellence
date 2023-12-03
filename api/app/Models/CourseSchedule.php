<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class CourseSchedule extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'course_id',
        'employee_id',
        'date',
        'day',
        'start_time',
        'end_time',
        'is_exam',
        'course_name',
        'classes',
        'class_link',
        'status',
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
        'course_id' => 'integer',
        'employee_id' => 'integer',
        //'day' => 'integer',
        //'date' => 'date',
        //'date'  => 'datetime::m-d-Y',
        'is_exam' => 'boolean',
        'status' => 'integer',
        'is_active' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

   /* public function getDateAttribute($date)
    {
        return $date ? Carbon::parse($date)->format('m-d-Y'):null;
    }*/

    public function courseCategories()
    {
        return $this->belongsToMany(CourseCategory::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function courseScheduleCancel()
    {
        return $this->belongsTo(CourseScheduleCancel::class);
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
