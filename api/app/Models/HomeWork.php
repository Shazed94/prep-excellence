<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class HomeWork extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'course_id',
        'submission_last_date',
        'file',
        'employee_id',
        'total_mark',
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
        'total_mark' => 'double',
        'is_active' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function getFileAttribute($file)
    {
        return $file ? env('APP_URL') . $file : null;
        //return $file ? Storage::disk('s3')->url($file) : null;
    }
    public function getSubmissionLastDateUsAttribute()
    {
        return $this->submission_last_date? Carbon::parse($this->submission_last_date)->format('m-d-Y') : null;
    }

    /*public function getSubmissionLastDateAttribute($submission_last_date)
    {
        return Carbon::parse($submission_last_date)->format('m-d-Y');
    }*/

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function studentHomeWorks()
    {
        return $this->hasMany(StudentHomeWork::class);
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
