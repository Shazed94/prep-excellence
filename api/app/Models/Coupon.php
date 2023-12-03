<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable=[
        'title', 'type', 'code', 'limit', 'used', 'discount', 'expiry_date',
        'minimum_spend', 'maximum_spend', 'user_id', 'status',
    ];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'limit' => 'integer',
        //'expiry_date' => 'date',
        'used' => 'integer',
        'status' => 'boolean',
    ];
}
