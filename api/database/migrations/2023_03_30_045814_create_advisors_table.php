<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvisorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('advisors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 191)->nullable();
            $table->string('image', 191)->nullable();
            $table->string('designation', 191)->nullable();
            $table->string('email', 191)->nullable();
            $table->string('phone_number', 100)->nullable();
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->nullable()->default(1);
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
        Schema::dropIfExists('advisors');
    }
}
