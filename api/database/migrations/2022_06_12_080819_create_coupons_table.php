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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('type')->nullable();
            $table->string('code')->unique();
            $table->integer('limit')->default(0);
            $table->integer('used')->default(0);
            $table->double('discount')->default(0);
            $table->timestamp('expiry_date')->nullable();
            $table->double('minimum_spend')->default(0);
            $table->double('maximum_spend')->default(0);
            $table->unsignedBigInteger('user_id')->nullable();
            $table->boolean('status')->default(false);
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
        Schema::dropIfExists('coupons');
    }
};
