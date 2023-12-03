<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class EmployeeOverTime extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'employee_id',
        'course_id',
        'date',
        'working_hour',
        'hour_rate',
        'work_type',
        'note',
        'status',
        'is_paid',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'employee_id' => 'integer',
        'course_id' => 'integer',
        'working_hour' => 'double',
        'hour_rate' => 'double',
        'status' => 'integer',
        'is_paid' => 'boolean',
    ];
    public function getDateUsAttribute()
    {
        return $this->date ? Carbon::parse($this->date)->format('m-d-Y'):null;
    }
    /*public function getDateAttribute($date)
    {
        return $date ? Carbon::parse($date)->format('m-d-Y'):null;
    }*/
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
