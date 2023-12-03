<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no', 100)->nullable();
            $table->unsignedBigInteger('expense_type_id')->nullable();
            $table->unsignedBigInteger('sub_expense_type_id')->nullable();
            $table->date('expense_date')->nullable();
            $table->double('amount')->default('0');
            $table->unsignedBigInteger('payment_type_id')->nullable();
            $table->unsignedBigInteger('bank_account_id')->nullable();
            $table->string('check_no', 100)->nullable();
            $table->date('check_date')->nullable();
            $table->text('note')->nullable();
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
        Schema::dropIfExists('expenses');
    }
}
