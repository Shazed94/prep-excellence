<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class EmployeeWorking extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'course_schedule_id',
        'employee_id',
        'date',
        'working_hour',
        'hour_rate',
        'is_paid',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'course_schedule_id' => 'integer',
        'employee_id' => 'integer',
        'working_hour' => 'double',
        'hour_rate' => 'double',
        'is_paid' => 'boolean',
    ];

    public function courseSchedule()
    {
        return $this->belongsTo(CourseSchedule::class);
    }
    public function getDateAttribute($date)
    {
        return $date ? Carbon::parse($date)->format('m-d-Y'):null;
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
