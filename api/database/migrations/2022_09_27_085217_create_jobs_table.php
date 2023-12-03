<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title', 191)->nullable();
            $table->string('image', 191)->nullable();
            $table->integer('vacancy')->nullable();
            $table->text('job_context')->nullable();
            $table->text('job_responsibilities')->nullable();
            $table->text('employment_status')->nullable();
            $table->text('educational_requirements')->nullable();
            $table->text('experience_requirements')->nullable();
            $table->text('additional_requirements')->nullable();
            $table->text('job_location')->nullable();
            $table->string('salary', 191)->nullable();
            $table->text('compensation_benefits')->nullable();
            $table->string('gender', 191)->nullable();
            $table->date('last_date')->nullable();
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
        Schema::dropIfExists('jobs');
    }
}
