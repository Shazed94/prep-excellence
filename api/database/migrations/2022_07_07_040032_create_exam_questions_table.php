<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExamQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_bank_id')->nullable()->constrained();
            $table->foreignId('exam_id')->nullable()->constrained();
            $table->tinyInteger('question_part')->nullable()->comment('1=sec 1, 2=sec 2, 3=sec 3, 4= sec 4');
            $table->tinyInteger('question_type')->default(1)->comment('1=mcq, 2=cq');
            $table->text('question')->nullable();
            $table->json('options')->comment('[option1, option2, option3,...]')->nullable();
            $table->text('answer')->nullable();
            $table->double('mark')->default('0');
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
        Schema::dropIfExists('exam_questions');
    }
}
