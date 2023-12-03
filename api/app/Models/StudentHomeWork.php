<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class StudentHomeWork extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'home_work_id',
        'student_id',
        'file',
        'submission_type',
        'mark',
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
        'home_work_id' => 'integer',
        'student_id' => 'integer',
        'mark' => 'double',
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
    public function homeWork()
    {
        return $this->belongsTo(HomeWork::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
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
