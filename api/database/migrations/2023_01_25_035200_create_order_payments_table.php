<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('order_payments', function (Blueprint $table) {
            $table->id();
            $table->string('status', 60)->nullable()->default('Pending');
            $table->foreignId('order_id')->nullable()->constrained();
            $table->integer('amount')->default(0);
            $table->string('gateway_order_id', 191)->nullable();
            $table->string('refund_order_id', 191)->nullable();
            $table->string('txn_number', 191)->nullable();
            $table->string('receipt_url', 191)->nullable();
            $table->text('note')->nullable();
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
        Schema::dropIfExists('order_payments');
    }
}
