<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SatScore extends Model
{
    use HasFactory,SoftDeletes;
    protected $fillable=[
        'sat_section_id', 'raw_score', 'reading', 'writing', 'math',
        'created_by', 'updated_by', 'ip', 'browser',
    ];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function satSection()
    {
        return $this->belongsTo(SatSection::class);
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
