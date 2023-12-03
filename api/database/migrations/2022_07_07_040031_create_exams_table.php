<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title',191)->nullable();
            $table->foreignId('course_id')->nullable()->constrained();
            $table->tinyInteger('time_type')->default(1)->comment('1=fixed, 2=not fixed');
            $table->date('exam_start_date')->nullable();
            $table->date('exam_end_date')->nullable();
            $table->timestamp('exam_start')->nullable();
            $table->timestamp('exam_end')->nullable();
            $table->double('duration')->default('0');
            $table->tinyInteger('exam_type')->default(1)->comment('1=regular, 2=SAT');
            $table->tinyInteger('question_type')->default(1)->comment('1=manual, 2=Pdf Upload');
            $table->string('question',191)->nullable();
            $table->foreignId('employee_id')->nullable()->constrained();
            $table->integer('status')->default(0);
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
        Schema::dropIfExists('exams');
    }
}
