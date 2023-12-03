<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Employee;
use App\Models\EmployeeOverTime;

class EmployeeOverTimeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmployeeOverTime::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'employee_id' => Employee::factory(),
            'date' => $this->faker->date(),
            'working_hour' => $this->faker->randomFloat(0, 0, 9999999999.),
            'hour_rate' => $this->faker->randomFloat(0, 0, 9999999999.),
            'work_type' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'note' => $this->faker->text,
            'status' => $this->faker->numberBetween(-8, 8),
            'is_paid' => $this->faker->boolean,
        ];
    }
}
