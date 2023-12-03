<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\TutoringRequest;

class TutoringRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TutoringRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'parent_name' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'email' => $this->faker->safeEmail,
            'phone_number' => $this->faker->phoneNumber,
            'student_name' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'student_school' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'student_grade' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'student_phone' => $this->faker->regexify('[A-Za-z0-9]{30}'),
            'student_email' => $this->faker->regexify('[A-Za-z0-9]{60}'),
            'course' => '{}',
            'other' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'student_need' => $this->faker->text,
            'day_time' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'day_time_tutoring' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'referral' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'question' => $this->faker->text,
            'status' => $this->faker->numberBetween(-8, 8),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
