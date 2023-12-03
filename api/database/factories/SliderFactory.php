<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Slider;
use App\Models\User;

class SliderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Slider::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'status' => $this->faker->boolean,
            'position' => $this->faker->numberBetween(-10000, 10000),
            'text_1' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'text_2' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'button_1_text' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'button_1_url' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'button_2_text' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'button_2_url' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'short_description' => $this->faker->text,
            'description' => $this->faker->text,
            'slider_type' => $this->faker->numberBetween(-8, 8),
            'image' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'video' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'slider_script' => $this->faker->text,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
