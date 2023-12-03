<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Course;
use App\Models\Employee;
use App\Models\Exam;
use App\Models\User;

class ExamFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Exam::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'course_id' => Course::factory(),
            'exam_start' => $this->faker->dateTime(),
            'exam_end' => $this->faker->dateTime(),
            'duration' => $this->faker->randomFloat(0, 0, 9999999999.),
            'employee_id' => Employee::factory(),
            'status' => $this->faker->numberBetween(-10000, 10000),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
