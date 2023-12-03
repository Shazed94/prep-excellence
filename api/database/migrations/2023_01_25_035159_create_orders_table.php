<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('status', 60)->nullable()->default('Pending');
            $table->boolean('admin_read')->default(false);
            $table->string('payment_status', 30)->nullable()->default('Pending');
            $table->foreignId('user_id')->nullable()->constrained();
            $table->integer('product_total')->default(0);
            $table->integer('tax')->default(0);
            $table->integer('tax_amount')->default(0);
            $table->integer('other_cost')->default(0);
            $table->integer('discount')->default(0);
            $table->integer('discount_amount')->default(0);
            $table->string('payment_method', 60)->nullable();
            $table->string('payment_transaction_id', 191)->nullable();
            $table->integer('refund_other_charge')->default(0);
            $table->integer('refund_product_total')->default(0);
            $table->integer('refund_tax_amount')->default(0);
            $table->integer('refund_total_amount')->default(0);
            $table->foreignId('coupon_id')->nullable()->constrained();
            $table->string('coupon_code', 191)->nullable();
            $table->text('note')->nullable();
            $table->text('staff_note')->nullable();
            $table->string('reference_no', 191)->nullable();
            $table->string('attachment', 191)->nullable();
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
        Schema::dropIfExists('orders');
    }
}
