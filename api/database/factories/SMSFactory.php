<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\SMS;

class SMSFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SMS::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'msisdn' => $this->faker->regexify('[A-Za-z0-9]{30}'),
            'text' => $this->faker->text,
            'csms_id' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'sms_type' => $this->faker->regexify('[A-Za-z0-9]{20}'),
            'status' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'try' => $this->faker->numberBetween(-8, 8),
            'is_sent' => $this->faker->numberBetween(-8, 8),
            'info' => '{}',
        ];
    }
}
