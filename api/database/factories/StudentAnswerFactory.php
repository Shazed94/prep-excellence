<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Student;
use App\Models\StudentAnswer;
use App\Models\User;

class StudentAnswerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = StudentAnswer::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'student_id' => Student::factory(),
            'exam_id' => Exam::factory(),
            'exam_question_id' => ExamQuestion::factory(),
            'student_answer' => $this->faker->text,
            'correct_answer' => $this->faker->text,
            'total_mark' => $this->faker->randomFloat(0, 0, 9999999999.),
            'mark' => $this->faker->randomFloat(0, 0, 9999999999.),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
