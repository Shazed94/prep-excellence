<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('employee_payments', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no', 191)->nullable();
            $table->foreignId('employee_id')->nullable()->constrained();
            $table->date('date')->nullable();
            $table->double('regular_hour')->default('0');
            $table->double('ot_hour')->default('0');
            $table->double('total_hour')->default('0');
            $table->double('regular_amount')->default('0');
            $table->double('ot_amount')->default('0');
            $table->double('total_amount')->default('0');
            $table->double('regular_hour_rate')->default('0');
            $table->double('ot_hour_rate')->default('0');
            $table->string('payment_type', 191)->nullable();
            $table->text('note')->nullable();
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
        Schema::dropIfExists('employee_payments');
    }
}
