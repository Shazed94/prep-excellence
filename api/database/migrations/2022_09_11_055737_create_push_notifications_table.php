<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePushNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('push_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('subject',191)->nullable();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->foreignId('role_id')->nullable()->constrained();
            $table->text('message')->nullable();
            $table->string('link', 191)->nullable();
            $table->boolean('is_notify')->default(0);
            $table->string('channel_name',100)->nullable();
            $table->boolean('is_seen')->default(0);
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
        Schema::dropIfExists('push_notifications');
    }
}
