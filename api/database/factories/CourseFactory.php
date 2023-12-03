<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Course;
use App\Models\CourseType;
use App\Models\User;

class CourseFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Course::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'course_type_id' => CourseType::factory(),
            'name' => $this->faker->name,
            'batch' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'amount' => $this->faker->randomFloat(0, 0, 9999999999.),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'duration_in_hour' => $this->faker->randomFloat(0, 0, 9999999999.),
            'duration_in_week' => $this->faker->numberBetween(-10000, 10000),
            'course_location' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'class_time' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'course_outline' => $this->faker->text,
            'position' => $this->faker->numberBetween(-10000, 10000),
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
