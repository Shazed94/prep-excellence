<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tutoring extends Model
{
    use HasFactory,SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'courses',
        'other',
        'student_need',
        'day_time',
        'day_time_tutoring',
        'referral',
        'question',
        'hour_rate',
        'total_hour',
        'amount',
        'tax',
        'tnx_no',
        'discount',
        'total_amount',
        'refund_amount',
        'is_paid',
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
        'user_id' => 'integer',
        'courses' => 'array',
        'status' => 'integer',
        'is_paid' => 'integer',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
