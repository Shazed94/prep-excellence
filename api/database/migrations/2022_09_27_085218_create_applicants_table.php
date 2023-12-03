<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->nullable()->constrained();
            $table->string('name', 191)->nullable();
            $table->string('email', 60)->nullable();
            $table->string('phone_number', 30)->nullable();
            $table->string('image', 191)->nullable();
            $table->string('referral', 191)->nullable();
            $table->string('school_college', 191)->nullable();
            $table->string('grade_year', 191)->nullable();
            $table->json('subjects')->nullable();
            $table->string('school_math_subject', 191)->nullable();
            $table->json('top_subjects')->nullable();
            $table->boolean('taught_class_before')->default(false)->nullable();
            $table->text('taught_details')->nullable();
            $table->boolean('tutored_before')->default(false);
            $table->string('how_long', 191)->nullable();
            $table->string('tutored_subject', 191)->nullable();
            $table->string('sat_score_english', 191)->nullable();
            $table->string('sat_score_math', 191)->nullable();
            $table->string('sat_score_total', 191)->nullable();
            $table->string('p_sat_score', 191)->nullable();
            $table->string('act_english_score', 191)->nullable();
            $table->string('act_math_score', 191)->nullable();
            $table->string('act_science_score', 191)->nullable();
            $table->string('act_reading_score', 191)->nullable();
            $table->string('act_total_score', 191)->nullable();
            $table->text('ap_exam_scores')->nullable();
            $table->string('hsc_gpa', 191)->nullable();
            $table->string('college_gpa', 191)->nullable();
            $table->json('available')->nullable();
            $table->string('available_hour', 191)->nullable();
            $table->text('preference_schedule')->nullable();
            $table->double('hourly_rate')->nullable();
            $table->boolean('willing_create_lesson')->default(false)->nullable();
            $table->text('willing_topics')->nullable();
            $table->text('lesson_rate')->nullable();
            $table->boolean('artical_write')->nullable()->default(false);
            $table->double('artical_rate')->nullable();
            $table->longText('short_description')->nullable();
            $table->boolean('is_agree')->nullable()->default(false);
            $table->string('cv_file', 191)->nullable();
            $table->boolean('publish_permission')->nullable()->default(false);
            $table->tinyInteger('status')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->string('ip', 50)->nullable();
            $table->text('browser')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('applicants');
    }
}
