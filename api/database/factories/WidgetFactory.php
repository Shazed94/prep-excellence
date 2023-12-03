<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Widget;

class WidgetFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Widget::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'placement' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'title' => $this->faker->sentence(4),
            'type' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'text' => $this->faker->text,
            'p_menu_id' => $this->faker->randomNumber(),
            'position' => $this->faker->numberBetween(-10000, 10000),
            'status' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
