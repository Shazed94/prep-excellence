<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class EmployeePayment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'invoice_no',
        'employee_id',
        'date',
        'regular_hour',
        'ot_hour',
        'total_hour',
        'regular_amount',
        'ot_amount',
        'total_amount',
        'regular_hour_rate',
        'ot_hour_rate',
        'payment_type',
        'note',
        'is_paid',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'employee_id' => 'integer',
        'regular_hour' => 'double',
        'ot_hour' => 'double',
        'total_hour' => 'double',
        'regular_amount' => 'double',
        'ot_amount' => 'double',
        'total_amount' => 'double',
        'regular_hour_rate' => 'double',
        'ot_hour_rate' => 'double',
        'is_paid' => 'boolean',
    ];
    public function getDateAttribute($date)
    {
        return $date ? Carbon::parse($date)->format('m-d-Y'):null;
    }
    public function employeeWorkings()
    {
        return $this->belongsToMany(EmployeeWorking::class);
    }

    public function employeeOverTimes()
    {
        return $this->belongsToMany(EmployeeOverTime::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
