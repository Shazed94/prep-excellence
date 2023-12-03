<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeeWorkingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('employee_workings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_schedule_id')->nullable()->constrained();
            $table->foreignId('employee_id')->nullable()->constrained();
            $table->date('date')->nullable();
            $table->double('working_hour')->default('0');
            $table->double('hour_rate')->default('0');
            $table->boolean('is_paid')->default(false);
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
        Schema::dropIfExists('employee_workings');
    }
}
