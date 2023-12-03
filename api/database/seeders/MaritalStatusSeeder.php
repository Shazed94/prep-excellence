<?php

namespace Database\Seeders;

use App\Models\MaritalStatus;
use Illuminate\Database\Seeder;

class MaritalStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $genders=[];
        $genders[] = [
            'id'=>1,
            'name'=>'Married',
        ];
        $genders[] = [
            'id'=>2,
            'name'=>'UnMarried',
        ];
        $genders[] = [
            'id'=>3,
            'name'=>'Divorced',
        ];
        MaritalStatus::insert($genders);
    }
}
