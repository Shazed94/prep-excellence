<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Parents extends Model
{
    use HasFactory, SoftDeletes;
    protected $table='parents';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'father_name',
        'father_profession',
        'father_phone_no',
        'father_nid',
        'mother_name',
        'mother_profession',
        'mother_phone_number',
        'mother_nid',
        'present_address',
        'parmanent_address',
        'local_guardian_name',
        'local_guardian_phone',
        'relation',
        'address',
        'is_active',
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
        //'present_address' => 'json',
        'parmanent_address' => 'array',
        'address' => 'array',
        'is_active' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function userable()
    {
        return $this->morphOne(User::class,'userable');
    }

    public function students()
    {
        return $this->hasMany(Student::class,'parent_id','id');
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
