<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactUs extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable=[
        'first_name', 'last_name', 'email', 'phone_number','subject', 'state_or_region', 'country',
        'student_grade', 'course',
        'other', 'day_time', 'message', 'created_by', 'updated_by', 'ip', 'browser',
    ];

    public function getNameAttribute()
    {
        return $this->first_name .' '. $this->last_name;
    }
}
