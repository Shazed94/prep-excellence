<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_type_id')->comment('subject')->nullable()->constrained();
            $table->tinyInteger('course_type')->default(1)->comment('1=regular, 2= One on One');
            $table->string('name', 191)->nullable();
            $table->string('batch', 100)->nullable();
            $table->double('amount')->default('0');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->double('duration_in_hour')->default('0');
            $table->integer('duration_in_week')->default(0);
            $table->string('course_location', 191)->nullable();
            $table->string('class_time', 191)->nullable();
            $table->longText('course_outline')->nullable();
            $table->integer('position')->default(1000);
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('courses');
    }
}
