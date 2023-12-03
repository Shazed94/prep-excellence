<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Advisor;
use App\Models\User;

class AdvisorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Advisor::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'designation' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'email' => $this->faker->safeEmail,
            'phone_number' => $this->faker->phoneNumber,
            'short_description' => $this->faker->text,
            'description' => $this->faker->text,
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
