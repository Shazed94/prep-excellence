<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Employee;
use App\Models\EmployeeQualification;
use App\Models\User;

class EmployeeQualificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmployeeQualification::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'employee_id' => Employee::factory(),
            'exam_name' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'institute' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'state' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'result' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'out_of_result' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
