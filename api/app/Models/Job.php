<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Job extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'image',
        'vacancy',
        'job_context',
        'job_responsibilities',
        'employment_status',
        'educational_requirements',
        'experience_requirements',
        'additional_requirements',
        'job_location',
        'salary',
        'compensation_benefits',
        'gender',
        'last_date',
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
        'employment_status' => 'string',
        //'last_date' => 'date',
        'created_by' => 'integer',
        'updated_by' => 'integer',
        'is_active' => 'boolean',
    ];

    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') . $image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
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
