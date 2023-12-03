<?php

namespace App\Models;

use App\Traits\CommonTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Blog extends Model
{
    use HasFactory, SoftDeletes, CommonTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'short_description',
        'description',
        'type',
        'image',
        'video',
        'embedded_code',
        'user_id',
        'category_id',
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
        'type' => 'integer',
        'user_id' => 'integer',
        'category_id' => 'integer',
        'status' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') . $image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function blogComments()
    {
        return $this->hasMany(BlogComment::class);
    }

    public function blogPreparedComments()
    {
        $comments = $this->hasMany(BlogComment::class);
        return $this->prepareComment($comments->toArray());
    }

    public function getCommentCountAttribute()
    {
        return $this->hasMany(BlogComment::class,'id','blog_id')->count();
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
