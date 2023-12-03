<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenuItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('p_menu_id')->nullable()->constrained();
            $table->string('name', 100)->nullable();
            $table->string('url', 100)->nullable();
            $table->unsignedBigInteger('relation_id')->nullable();
            $table->string('relation_with', 100)->nullable();
            $table->unsignedBigInteger('menu_item_id')->nullable();
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
        Schema::dropIfExists('menu_items');
    }
}
