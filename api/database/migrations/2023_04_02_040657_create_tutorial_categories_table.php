<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTutorialCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('tutorial_categories', function (Blueprint $table) {
            $table->id();
            $table->string('title', 191)->nullable();
            $table->foreignId('tutorial_category_id')->nullable()->constrained('tutorial_categories');
            $table->text('role_ids')->nullable();
            $table->longText('description')->nullable();
            $table->integer('position')->nullable()->default(1000);
            $table->boolean('is_active')->nullable()->default(true);
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
        Schema::dropIfExists('tutorial_categories');
    }
}
