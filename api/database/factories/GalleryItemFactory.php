<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Gallery;
use App\Models\GalleryItem;
use App\Models\User;

class GalleryItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = GalleryItem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'gallery_id' => Gallery::factory(),
            'type' => $this->faker->numberBetween(-8, 8),
            'image' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'video' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'embedded_code' => $this->faker->text,
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
