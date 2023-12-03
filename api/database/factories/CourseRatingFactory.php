<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Course;
use App\Models\CourseRating;
use App\Models\User;

class CourseRatingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CourseRating::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'course_id' => Course::factory(),
            'user_id' => User::factory(),
            'rating' => $this->faker->randomFloat(0, 0, 9999999999.),
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
