<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Complain;
use App\Models\User;

class ComplainFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Complain::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'subject' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'message' => $this->faker->text,
            'review' => $this->faker->text,
            'status' => $this->faker->numberBetween(-8, 8),
        ];
    }
}
