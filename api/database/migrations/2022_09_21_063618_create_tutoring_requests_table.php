<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTutoringRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tutoring_requests', function (Blueprint $table) {
            $table->id();
            $table->string('parent_name', 191)->nullable();
            $table->string('email', 60)->nullable();
            $table->string('phone_number', 30)->nullable();
            $table->string('student_name', 191)->nullable();
            $table->string('student_school', 191)->nullable();
            $table->string('student_grade', 191)->nullable();
            $table->string('student_phone', 30)->nullable();
            $table->string('student_email', 60)->nullable();
            $table->json('course')->nullable();
            $table->string('other', 191)->nullable();
            $table->text('student_need')->nullable();
            $table->string('day_time', 191)->nullable();
            $table->string('day_time_tutoring', 191)->nullable();
            $table->string('referral', 191)->nullable();
            $table->text('question')->nullable();
            $table->tinyInteger('status')->default(0);
            $table->string('ip', 50)->nullable();
            $table->text('browser')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tutoring_requests');
    }
}
