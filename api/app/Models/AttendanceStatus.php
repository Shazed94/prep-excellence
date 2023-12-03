<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttendanceStatus extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable=['name','is_active'];
}
