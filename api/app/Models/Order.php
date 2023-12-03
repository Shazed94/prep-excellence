<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'status',
        'admin_read',
        'payment_status',
        'user_id',
        'product_total',
        'tax',
        'tax_amount',
        'other_cost',
        'discount',
        'discount_amount',
        'payment_method',
        'payment_transaction_id',
        'refund_other_charge',
        'refund_product_total',
        'refund_tax_amount',
        'refund_total_amount',
        'coupon_id',
        'coupon_code',
        'note',
        'staff_note',
        'reference_no',
        'attachment',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'admin_read' => 'boolean',
        'user_id' => 'integer',
        'coupon_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function studentCourses()
    {
        return $this->hasMany(StudentCourse::class);
    }
    public function courses()
    {
        return $this->hasManyThrough(
            Course::class,
            StudentCourse::class,
            'order_id', // Foreign key on the StudentCourse with orders table...
            'id', // Foreign key on the course with StudentCourse table...
            'id', // order table Foreign key table...
            'course_id' // StudentCourse table Foreign key with Course table...
        );
    }

    public function getTotalAttribute()
    {
        $total = $this->product_total + $this->tax_amount + $this->other_cost - $this->discount_amount;
        return max($total, 0);
    }

    public function orderPayment()
    {
        return $this->hasOne(OrderPayment::class);
    }
}
