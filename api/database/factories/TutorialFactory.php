<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Tutorial;
use App\Models\User;

class TutorialFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Tutorial::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(4),
            'tutorial_category_id' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'short_description' => $this->faker->text,
            'description' => $this->faker->text,
            'images' => $this->faker->regexify('[A-Za-z0-9]{255}'),
            'position' => $this->faker->numberBetween(-10000, 10000),
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
