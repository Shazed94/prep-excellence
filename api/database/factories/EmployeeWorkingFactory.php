<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\CourseSchedule;
use App\Models\Employee;
use App\Models\EmployeeWorking;

class EmployeeWorkingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmployeeWorking::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'course_schedule_id' => CourseSchedule::factory(),
            'employee_id' => Employee::factory(),
            'date' => $this->faker->date(),
            'working_hour' => $this->faker->randomFloat(0, 0, 9999999999.),
            'hour_rate' => $this->faker->randomFloat(0, 0, 9999999999.),
            'is_paid' => $this->faker->boolean,
        ];
    }
}
