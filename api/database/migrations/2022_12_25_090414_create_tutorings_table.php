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
        Schema::create('tutorings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->json('courses')->nullable();
            $table->string('other', 191)->nullable();
            $table->text('student_need')->nullable();
            $table->string('day_time', 191)->nullable();
            $table->string('day_time_tutoring', 191)->nullable();
            $table->string('referral', 191)->nullable();
            $table->text('question')->nullable();
            $table->double('total_hour')->default(0);
            $table->double('hour_rate')->default(0);
            $table->double('amount')->default(0);
            $table->double('tax')->default(0);
            $table->double('discount')->default(0);
            $table->double('total_amount')->default(0);
            $table->double('refund_amount')->default(0);
            $table->string('payment_method',100)->nullable();
            $table->string('tnx_no',100)->nullable();
            $table->boolean('is_paid')->default(false);
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
        Schema::dropIfExists('tutorings');
    }
};
