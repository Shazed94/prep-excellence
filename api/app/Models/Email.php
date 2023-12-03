<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Email extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'subject',
        'email',
        'message',
        'file',
        'try',
        'is_sent',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'try' => 'integer',
        'is_sent' => 'integer',
    ];

    public function getFileAttribute($file)
    {
        return $file ? env('APP_URL') . $file : null;
        //return $file ? Storage::disk('s3')->url($file) : null;
    }
}
