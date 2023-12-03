<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Parents;
use App\Models\User;

class ParentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Parents::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'father_name' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'father_profession' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'father_phone_no' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'father_nid' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'mother_name' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'mother_profession' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'mother_phone_number' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'mother_nid' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'present_address' => '{}',
            'parmanent_address' => '{}',
            'local_guardian_name' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'local_guardian_phone' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'relation' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'address' => '{}',
            'is_active' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
