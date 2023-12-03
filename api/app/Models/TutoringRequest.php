<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TutoringRequest extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'parent_name',
        'email',
        'phone_number',
        'student_name',
        'student_school',
        'student_grade',
        'student_phone',
        'student_email',
        'course',
        'other',
        'student_need',
        'day_time',
        'day_time_tutoring',
        'referral',
        'question',
        'status',
        'ip',
        'browser',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'course' => 'array',
        'status' => 'integer',
    ];
}
