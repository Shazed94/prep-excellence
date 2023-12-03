<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Course;
use App\Models\Student;
use App\Models\StudentCourse;
use App\Models\User;

class StudentCourseFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = StudentCourse::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'student_id' => Student::factory(),
            'course_id' => Course::factory(),
            'amount' => $this->faker->randomFloat(0, 0, 9999999999.),
            'payment_status' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'payment_type' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'transaction_no' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'payment_details' => $this->faker->text,
            'is_approved' => $this->faker->boolean,
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
