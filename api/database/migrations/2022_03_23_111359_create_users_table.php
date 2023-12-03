<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->nullable()->constrained();
            $table->morphs('userable');
            $table->string('first_name', 191);
            $table->string('last_name', 191);
            $table->string('email', 60)->nullable();
            $table->string('phone_number', 60)->nullable();
            $table->string('image', 100)->nullable();
            $table->foreignId('gender_id')->nullable()->constrained();
            $table->foreignId('blood_group_id')->nullable()->constrained();
            $table->foreignId('religion_id')->nullable()->constrained();
            $table->string('password', 191);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->string('ip', 50)->nullable();
            $table->text('browser')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
