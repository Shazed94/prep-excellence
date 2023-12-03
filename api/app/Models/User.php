<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'role_id',
        'userable_type',
        'userable_id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'image',
        'gender_id',
        'blood_group_id',
        'religion_id',
        'password',
        'is_active',
        'created_by',
        'updated_by',
        'ip',
        'browser',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'role_id' => 'integer',
        'userable_id' => 'integer',
        'gender_id' => 'integer',
        'blood_group_id' => 'integer',
        'religion_id' => 'integer',
        'is_active' => 'boolean',
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    protected $appends=[
        'name'
    ];
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function userable()
    {
        return $this->morphTo();
    }
    public function getImageAttribute($image)
    {
        return $image ? env('APP_URL') . $image : null;
        //return $image ? Storage::disk('s3')->url($image) : null;
    }
    public function getNameAttribute()
    {
        return $this->first_name .' '. $this->last_name;
    }

    public function menuPermissions()
    {
        return $this->belongsToMany(MenuPermission::class, 'user_menu_permissions')->withPivot('id');
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }

    public function bloodGroup()
    {
        return $this->belongsTo(BloodGroup::class);
    }

    public function religion()
    {
        return $this->belongsTo(Religion::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function receiveMessages()
    {
        return $this->hasMany(Chat::class,'receiver_id','id');
    }
    public function receiveMessagesUnseen()
    {
        return $this->hasMany(Chat::class,'sender_id','id')->where('is_seen',0);
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }
}
