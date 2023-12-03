<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'image',
        'bread_crumb_image',
        'template',
        'service_title',
        'service_sub_title',
        'services',
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
        'template' => 'integer',
        'status' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];
    public function getBreadCrumbImageAttribute($image)
    {
        return $image ? env('APP_URL') . $image : null;
    }
    public function getImageAttribute($bread_crumb_image)
    {
        return $bread_crumb_image ? env('APP_URL') . $bread_crumb_image : null;
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class);
    }

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class,'relation_id','id');
    }
}
