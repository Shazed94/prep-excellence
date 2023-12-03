<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\QuestionBank;
use App\Models\User;

class ExamQuestionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ExamQuestion::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'question_bank_id' => QuestionBank::factory(),
            'exam_id' => Exam::factory(),
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
