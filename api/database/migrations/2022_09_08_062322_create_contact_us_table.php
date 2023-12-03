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
        Schema::create('contact_us', function (Blueprint $table) {
            $table->id();
            $table->string('first_name',191)->nullable();
            $table->string('last_name',191)->nullable();
            $table->string('email',60)->nullable();
            $table->string('phone_number',30)->nullable();
            $table->string('state_or_region',191)->nullable();
            $table->string('country',191)->nullable();
            $table->string('student_grade',191)->nullable();
            $table->json('course')->nullable();
            $table->string('other',191)->nullable();
            $table->string('day_time',191)->nullable();
            $table->longText('message')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
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
        Schema::dropIfExists('contact_us');
    }
};
