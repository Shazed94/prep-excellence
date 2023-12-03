<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\MenuItem;
use App\Models\PMenu;
use App\Models\User;

class MenuItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MenuItem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'p_menu_id' => PMenu::factory(),
            'name' => $this->faker->name,
            'url' => $this->faker->url,
            'relation_id' => $this->faker->randomNumber(),
            'relation_with' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'menu_item_id' => $this->faker->randomNumber(),
            'position' => $this->faker->numberBetween(-10000, 10000),
            'status' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
            'softdeletes' => $this->faker->word,
        ];
    }
}
