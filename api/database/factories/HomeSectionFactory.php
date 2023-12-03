<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\HomeSection;
use App\Models\SectionDesignType;
use App\Models\User;

class HomeSectionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = HomeSection::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'section_design_type_id' => SectionDesignType::factory(),
            'section_name' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'section_name_is_show' => $this->faker->boolean,
            'bg_type' => $this->faker->numberBetween(-8, 8),
            'bg_image' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'bg_color' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'col' => $this->faker->numberBetween(-10000, 10000),
            'row' => $this->faker->numberBetween(-10000, 10000),
            'title' => $this->faker->sentence(4),
            'sub_title' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'text_align' => $this->faker->numberBetween(-8, 8),
            'type' => $this->faker->numberBetween(-8, 8),
            'image' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'video' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'video_script' => $this->faker->text,
            'short_description' => $this->faker->text,
            'description' => $this->faker->text,
            'button_name' => $this->faker->regexify('[A-Za-z0-9]{100}'),
            'button_url' => $this->faker->regexify('[A-Za-z0-9]{100}'),
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
