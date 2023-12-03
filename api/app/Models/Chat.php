<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chat extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'chat_group_id',
        'message',
        'is_seen',
        'ip',
        'browser',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'sender_id' => 'integer',
        'receiver_id' => 'integer',
        'chat_group_id' => 'integer',
        'is_seen' => 'boolean',
    ];

    public function chatFiles()
    {
        return $this->belongsToMany(ChatFile::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class);
    }

    public function reviver()
    {
        return $this->belongsTo(User::class);
    }

    public function chatGroup()
    {
        return $this->belongsTo(ChatGroup::class);
    }
}
