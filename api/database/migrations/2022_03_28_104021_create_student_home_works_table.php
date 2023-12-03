<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentHomeWorksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('student_home_works', function (Blueprint $table) {
            $table->id();
            $table->foreignId('home_work_id')->nullable()->constrained();
            $table->foreignId('student_id')->nullable()->constrained();
            $table->string('file', 100)->nullable();
            $table->string('submission_type', 100)->nullable()->comment('on time, late submission');
            $table->double('mark')->default('0');
            $table->double('total_mark')->default('0');
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
        Schema::dropIfExists('student_home_works');
    }
}
