<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSlidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->boolean('status')->default(true);
            $table->integer('position')->default(1000);
            $table->string('text_1', 100)->nullable();
            $table->string('text_2', 100)->nullable();
            $table->string('button_1_text', 100)->nullable();
            $table->string('button_1_url', 100)->nullable();
            $table->string('button_2_text', 100)->nullable();
            $table->string('button_2_url', 100)->nullable();
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->tinyInteger('slider_type')->comment('1=image, 2=video, 3=script');
            $table->string('image', 100)->nullable();
            $table->string('video', 100)->nullable();
            $table->text('slider_script')->nullable();
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
        Schema::dropIfExists('sliders');
    }
}
