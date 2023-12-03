<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Parent;
use App\Models\Student;
use App\Models\User;

class StudentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Student::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'student_id' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'roll_no' => $this->faker->numberBetween(-10000, 10000),
            'image' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'parent_id' => Parent::factory(),
            'date_of_birth' => $this->faker->date(),
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
