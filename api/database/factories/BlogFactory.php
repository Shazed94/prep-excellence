<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Blog;
use App\Models\User;

class BlogFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Blog::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(4),
            'short_description' => $this->faker->text,
            'description' => $this->faker->text,
            'type' => $this->faker->numberBetween(-8, 8),
            'image' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'video' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'embedded_code' => $this->faker->text,
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'position' => $this->faker->numberBetween(-10000, 10000),
            'status' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
