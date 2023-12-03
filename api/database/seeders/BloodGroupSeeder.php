<?php

namespace Database\Seeders;

use App\Models\BloodGroup;
use Illuminate\Database\Seeder;

class BloodGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $blood_groups=[];
        $blood_groups[] = [
            'id'=>1,
            'name'=>'A+',
        ];
        $blood_groups[] = [
            'id'=>2,
            'name'=>'A-'
        ];
        $blood_groups[] = [
            'id'=>3,
            'name'=>'B+'
        ];
        $blood_groups[] = [
            'id'=>4,
            'name'=>'B-'
        ];
        $blood_groups[] = [
            'id'=>5,
            'name'=>'AB+'
        ];
        $blood_groups[] = [
            'id'=>6,
            'name'=>'AB-'
        ];
        BloodGroup::insert($blood_groups);
    }
}
