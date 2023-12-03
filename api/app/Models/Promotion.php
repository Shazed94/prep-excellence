<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable=[
        'status',
        'position',
        'image',
        'title',
        'button_text',
        'button_url',
        'description',
    ];
    protected $casts=[
        'status'=>'boolean'
    ];
    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') .$image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
    }

}
