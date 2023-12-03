<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExamQuestion extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'question_bank_id',
        'exam_id',
        'question_part',
        'question_type',
        'question',
        'options',
        'answer',
        'mark',
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
        'question_part' => 'integer',
        'question_bank_id' => 'integer',
        'exam_id' => 'integer',
        'question_type' => 'integer',
        //'options' => 'array',
        'mark' => 'double',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function questionBank()
    {
        return $this->belongsTo(QuestionBank::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
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
