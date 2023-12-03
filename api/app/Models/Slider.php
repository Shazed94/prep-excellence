<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Slider extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'status',
        'position',
        'text_1',
        'text_2',
        'button_1_text',
        'button_1_url',
        'button_2_text',
        'button_2_url',
        'short_description',
        'description',
        'slider_type',
        'image',
        'video',
        'slider_script',
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
        'status' => 'boolean',
        'slider_type' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];
    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') . $image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
    }
    public function getVideoAttribute($video)
    {
        return $video ? env('APP_URL') . $video : null;
        //return $video ? Storage::disk('s3')->url($video) : null;
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
