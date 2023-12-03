<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHomeSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_design_type_id')->nullable()->constrained();
            $table->string('section_name', 191);
            $table->boolean('section_name_is_show')->default(true);
            $table->tinyInteger('bg_type')->default(1)->comment('1=color, 2=image');
            $table->string('bg_image', 100)->nullable();
            $table->string('bg_color', 100)->nullable();
            $table->integer('col')->nullable();
            $table->integer('row')->nullable();
            $table->string('title', 191)->nullable();
            $table->string('sub_title', 191)->nullable();
            $table->tinyInteger('text_align')->nullable()->comment('1=left, 2=right');
            $table->tinyInteger('type')->nullable()->comment('1=image, 2=video, 3=script');
            $table->string('image', 100)->nullable();
            $table->string('video', 100)->nullable();
            $table->text('video_script')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('button_name', 100)->nullable();
            $table->string('button_url', 100)->nullable();
            $table->integer('position')->default(1000);
            $table->boolean('status')->default(true);
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
        Schema::dropIfExists('home_sections');
    }
}
