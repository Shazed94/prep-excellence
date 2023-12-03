<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\MaritalStatus;
use App\Models\User;

class EmployeeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'employee_id' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'designation_id' => Designation::factory(),
            'father_name' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'mother_name' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'nid' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'marital_status_id' => MaritalStatus::factory(),
            'emergency_contact' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'present_address' => $this->faker->text,
            'permanent_address' => $this->faker->text,
            'join_date' => $this->faker->date(),
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
