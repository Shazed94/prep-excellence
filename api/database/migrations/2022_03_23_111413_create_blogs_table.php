<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100)->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->tinyInteger('type')->comment('1=image, 2=video, 3=script');
            $table->string('image', 100)->nullable();
            $table->string('video', 100)->nullable();
            $table->text('embedded_code')->nullable();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->foreignId('category_id')->nullable()->constrained('categoreies');
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
        Schema::dropIfExists('blogs');
    }
}
