<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSMSTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('s_m_s', function (Blueprint $table) {
            $table->id();
            $table->string('msisdn', 30)->nullable(); //customer phone number
            $table->text('text')->nullable();//message body
            $table->string('csms_id', 191)->nullable(); //csms id must be unique
            $table->string('sms_type', 20)->nullable()->default('EN');//BN or EN
            $table->string('status', 100)->nullable()->default('Pending');
            $table->tinyInteger('try')->default(0);
            $table->tinyInteger('is_sent')->default(0);
            $table->json('info')->nullable();
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
        Schema::dropIfExists('s_m_s');
    }
}
