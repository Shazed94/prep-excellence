<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Testimonial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable=[
        'position',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'image',
        'message',
        'status',
    ];
    protected $casts=[
        'status' => 'boolean',
    ];
    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') .$image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
    }

    public function getNameAttribute()
    {
        return $this->first_name.' '.$this->last_name;
    }
}
