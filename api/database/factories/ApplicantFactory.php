<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Applicant;
use App\Models\Job;
use App\Models\User;

class ApplicantFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Applicant::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'job_id' => Job::factory(),
            'name' => $this->faker->name,
            'email' => $this->faker->safeEmail,
            'phone_number' => $this->faker->phoneNumber,
            'image' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'referral' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'school_college' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'grade_year' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'subjects' => '{}',
            'school_math_subject' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'top_subjects' => '{}',
            'taught_class_before' => $this->faker->boolean,
            'taught_details' => $this->faker->text,
            'tutored_before' => $this->faker->boolean,
            'how_long' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'tutored_subject' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'sat_ score_english' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'sat_ score_math' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'sat_ score_total' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'p_sat_score' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'act_english_score' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'act_math_score' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'act_science_score' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'act_reading_score' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'act_total_score' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'ap_exam_scores' => $this->faker->text,
            'hsc_gpa' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'college_gpa' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'available' => '{}',
            'available_hour' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'preference_schedule' => $this->faker->text,
            'hourly_rate' => $this->faker->randomFloat(0, 0, 9999999999.),
            'willing_create_lesson' => $this->faker->boolean,
            'willing_ topics' => $this->faker->text,
            'lesson_rate' => $this->faker->text,
            'artical_write' => $this->faker->boolean,
            'artical_rate' => $this->faker->randomFloat(0, 0, 9999999999.),
            'short_description' => $this->faker->text,
            'is_agree' => $this->faker->boolean,
            'cv_file' => $this->faker->regexify('[A-Za-z0-9]{191}'),
            'publish_permission' => $this->faker->boolean,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'ip' => $this->faker->regexify('[A-Za-z0-9]{50}'),
            'browser' => $this->faker->text,
        ];
    }
}
