<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class Exam extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'time_type', 'exam_start_date', 'exam_end_date',
        'course_id',
        'exam_start',
        'exam_end',
        'duration',
        'exam_type',
        'question_type',
        'sat_section_id',
        'question',
        'employee_id',
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
        'time_type' => 'integer',
        'exam_type' => 'integer',
        'question_type' => 'integer',
        'sat_section_id' => 'integer',
        'course_id' => 'integer',
        'employee_id' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
        'status' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function examQuestions()
    {
        return $this->hasMany(ExamQuestion::class);
    }
    /*public function getQuestionAttribute($question)
    {
        //return $question ? public_path($question) : null;
        //return $question ? env('APP_URL') . $question : null;
        //return $question ? Storage::disk('s3')->url($question) : null;

        $base_64=null;
        if ($question){
            if (File::exists(public_path($question))){
                $question = file_get_contents(public_path($question));
                if ($question !== false){
                    $base_64 = 'data:application/pdf;base64,'.base64_encode($question);
                }
            }

        }
        return $base_64;
    }*/

    public function studentAnswers()
    {
        return $this->hasMany(StudentAnswer::class);
    }

    public function satSection()
    {
        return $this->belongsTo(SatSection::class);
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
