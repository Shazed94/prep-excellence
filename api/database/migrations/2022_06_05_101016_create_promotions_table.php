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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('image',100)->nullable();
            $table->string('title',191)->nullable();
            $table->string('button_text',191)->nullable();
            $table->string('button_url',191)->nullable();
            $table->text('description')->nullable();
            $table->boolean('status')->default(1);
            $table->integer('position')->default(1000);
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
        Schema::dropIfExists('promotons');
    }
};
