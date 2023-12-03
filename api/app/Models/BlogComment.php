<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlogComment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'blog_id',
        'blog_comment_id',
        'name',
        'email',
        'phone_number',
        'comment',
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
        'blog_id' => 'integer',
        'blog_comment_id' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }

    public function blogComment()
    {
        return $this->belongsTo(BlogComment::class);
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
