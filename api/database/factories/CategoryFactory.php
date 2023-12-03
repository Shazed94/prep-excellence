<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\User;

class CategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'status' => $this->faker->boolean,
            'fetcher' => $this->faker->boolean,
            'fetcher_position' => $this->faker->numberBetween(10000, 20000),
            'category_able_type' => $this->faker->word,
            'category_able_id' => $this->faker->numberBetween(100000, 200000),
            'title' => $this->faker->sentence(4),
            'short_description' => $this->faker->text,
            'description' => $this->faker->text,
            'category_id' => $this->faker->randomNumber(),
            'image' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            //'created_by' => User::factory(),
            //'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
