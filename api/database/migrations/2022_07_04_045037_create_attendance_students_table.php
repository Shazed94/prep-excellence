<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attendance_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->nullable()->references('id')->on('students')->onDelete('cascade');
            $table->foreignId('employee_id')->nullable()->references('id')->on('employees')->onDelete('cascade');
            $table->foreignId('course_id')->nullable()->references('id')->on('courses')->onDelete('cascade');
            $table->foreignId('attendance_status_id')->nullable()->references('id')->on('attendance_statuses')->onDelete('cascade');
            $table->foreignId('course_schedule_id')->nullable()->references('id')->on('course_schedules')->onDelete('cascade');
            $table->date('date');
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
        Schema::dropIfExists('attendance_students');
    }
};
