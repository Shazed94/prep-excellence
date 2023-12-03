<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Email;

class EmailFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Email::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'subject' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'email' => $this->faker->safeEmail,
            'message' => $this->faker->text,
            'try' => $this->faker->numberBetween(-8, 8),
            'is_sent' => $this->faker->numberBetween(-8, 8),
        ];
    }
}
