<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuItem extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'p_menu_id',
        'name',
        'url',
        'relation_id',
        'relation_with',
        'menu_item_id',
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
        'p_menu_id' => 'integer',
        'relation_id' => 'integer',
        'menu_item_id' => 'integer',
        'status' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function pMenu()
    {
        return $this->belongsTo(PMenu::class);
    }

    public function menuItem()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function page()
    {
        return $this->belongsTo(Page::class,'relation_id','id');
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
