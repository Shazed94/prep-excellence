<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('parents', function (Blueprint $table) {
            $table->id();
            $table->string('father_name', 100)->nullable();
            $table->string('father_profession', 100)->nullable();
            $table->string('father_phone_no', 100)->nullable();
            $table->string('father_nid', 100)->nullable();
            $table->string('mother_name', 100)->nullable();
            $table->string('mother_profession', 100)->nullable();
            $table->string('mother_phone_number', 100)->nullable();
            $table->string('mother_nid', 100)->nullable();
            $table->json('present_address')->nullable();
            $table->json('parmanent_address')->nullable();
            $table->string('local_guardian_name', 100)->nullable();
            $table->string('local_guardian_phone', 100)->nullable();
            $table->string('relation', 100)->nullable();
            $table->json('address')->nullable();
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('parents');
    }
}
