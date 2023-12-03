<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'status',
        'fetcher',
        'fetcher_position',
        'type',
        'title',
        'short_description',
        'description',
        'category_id',
        'image',
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
        'fetcher' => 'boolean',
        'type' => 'integer',
        'category_id' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function galleries()
    {
        return $this->hasMany(Gallery::class);
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class);
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
