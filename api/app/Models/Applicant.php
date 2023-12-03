<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Applicant extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'job_id',
        'name',
        'email',
        'phone_number',
        'image',
        'referral',
        'school_college',
        'grade_year',
        'subjects',
        'school_math_subject',
        'top_subjects',
        'taught_class_before',
        'taught_details',
        'tutored_before',
        'how_long',
        'tutored_subject',
        'sat_score_english',
        'sat_score_math',
        'sat_score_total',
        'p_sat_score',
        'act_english_score',
        'act_math_score',
        'act_science_score',
        'act_reading_score',
        'act_total_score',
        'ap_exam_scores',
        'hsc_gpa',
        'college_gpa',
        'available',
        'available_hour',
        'preference_schedule',
        'hourly_rate',
        'willing_create_lesson',
        'willing_topics',
        'lesson_rate',
        'artical_write',
        'artical_rate',
        'short_description',
        'is_agree',
        'cv_file',
        'publish_permission',
        'status',
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
        'job_id' => 'integer',
        'subjects' => 'array',
        'top_subjects' => 'array',
        'taught_class_before' => 'boolean',
        'tutored_before' => 'boolean',
        'available' => 'array',
        'hourly_rate' => 'double',
        'willing_create_lesson' => 'boolean',
        'artical_write' => 'boolean',
        'artical_rate' => 'double',
        'is_agree' => 'boolean',
        'publish_permission' => 'boolean',
        'status' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') . $image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
    }

    public function getCvFileAttribute($cv_file)
    {
        return $cv_file ? env('APP_URL') . $cv_file : null;
        //return $cv_file ? Storage::disk('s3')->url($cv_file) : null;
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
