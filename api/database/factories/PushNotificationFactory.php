<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PushNotification;
use App\Models\Role;
use App\Models\User;

class PushNotificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PushNotification::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'role_id' => Role::factory(),
            'message' => $this->faker->text,
            'link' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'is_seen' => $this->faker->boolean,
        ];
    }
}
