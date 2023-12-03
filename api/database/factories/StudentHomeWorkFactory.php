<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\HomeWork;
use App\Models\Student;
use App\Models\StudentHomeWork;
use App\Models\User;

class StudentHomeWorkFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = StudentHomeWork::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'home_work_id' => HomeWork::factory(),
            'student_id' => Student::factory(),
            'file' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'submission_type' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'mark' => $this->faker->randomFloat(0, 0, 9999999999.),
            'total_mark' => $this->faker->randomFloat(0, 0, 9999999999.),
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
