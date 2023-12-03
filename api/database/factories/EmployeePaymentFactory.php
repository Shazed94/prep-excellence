<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Employee;
use App\Models\EmployeePayment;

class EmployeePaymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmployeePayment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'invoice_no' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'employee_id' => Employee::factory(),
            'date' => $this->faker->date(),
            'regular_hour' => $this->faker->randomFloat(0, 0, 9999999999.),
            'ot_hour' => $this->faker->randomFloat(0, 0, 9999999999.),
            'total_hour' => $this->faker->randomFloat(0, 0, 9999999999.),
            'regular_amount' => $this->faker->randomFloat(0, 0, 9999999999.),
            'ot_amount' => $this->faker->randomFloat(0, 0, 9999999999.),
            'total_amount' => $this->faker->randomFloat(0, 0, 9999999999.),
            'regular_hour_rate' => $this->faker->randomFloat(0, 0, 9999999999.),
            'ot_hour_rate' => $this->faker->randomFloat(0, 0, 9999999999.),
            'payment_type' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'note' => $this->faker->text,
            'is_paid' => $this->faker->boolean,
        ];
    }
}
