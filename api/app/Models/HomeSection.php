<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class HomeSection extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'section_design_type_id',
        'section_name',
        'section_name_is_show',
        'bg_type',
        'bg_image',
        'bg_color',
        'col',
        'row',
        'title',
        'sub_title',
        'text_align',
        'type',
        'image',
        'video',
        'video_script',
        'short_description',
        'description',
        'button_name',
        'button_url',
        'position',
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
        'id' => 'integer',
        'section_design_type_id' => 'integer',
        'section_name_is_show' => 'boolean',
        'bg_type' => 'integer',
        'text_align' => 'integer',
        'type' => 'integer',
        'status' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') . $image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
    }
    public function getBgImageAttribute($bg_image)
    {
        return $bg_image ? env('APP_URL') . $bg_image : null;
        //return $bg_image ? Storage::disk('s3')->url($bg_image) : null;

    }
    public function getvideoAttribute($video)
    {
        return $video ? env('APP_URL') . $video : null;
        //return $video ? Storage::disk('s3')->url($video) : null;
    }

    public function sectionDesignType()
    {
        return $this->belongsTo(SectionDesignType::class);
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
