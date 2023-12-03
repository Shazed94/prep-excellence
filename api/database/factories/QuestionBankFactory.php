<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Course;
use App\Models\Employee;
use App\Models\QuestionBank;
use App\Models\User;

class QuestionBankFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = QuestionBank::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'course_id' => Course::factory(),
            'employee_id' => Employee::factory(),
            'question_type' => $this->faker->numberBetween(-8, 8),
            'question' => $this->faker->text,
            'options' => '{}',
            'answer' => $this->faker->text,
            'mark' => $this->faker->randomFloat(0, 0, 9999999999.),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
