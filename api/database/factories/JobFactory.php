<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Job;
use App\Models\User;

class JobFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Job::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(4),
            'vacancy' => $this->faker->numberBetween(-10000, 10000),
            'job_context' => $this->faker->text,
            'job_responsibilities' => $this->faker->text,
            'employment_status' => '{}',
            'educational_requirements' => $this->faker->text,
            'experience_requirements' => $this->faker->text,
            'additional_requirements' => $this->faker->text,
            'job_location' => $this->faker->text,
            'salary' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'compensation_benefits' => $this->faker->text,
            'gender' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'last_date' => $this->faker->date(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
