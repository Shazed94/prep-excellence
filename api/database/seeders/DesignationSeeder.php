<?php

namespace Database\Seeders;

use App\Models\Designation;
use Illuminate\Database\Seeder;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Designation::factory()->count(5)->create();

        Designation::insert([
            'id'=>1,
            'name'=>'Accountant',
        ]);
    }
}
