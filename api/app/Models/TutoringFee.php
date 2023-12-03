<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TutoringFee extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable=[
        'hour_rate', 'hour_rate_after', 'hour_rate2',
        'is_active', 'created_by', 'updated_by', 'ip', 'browser', 'deleted_at',
    ];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'is_active' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];
}
