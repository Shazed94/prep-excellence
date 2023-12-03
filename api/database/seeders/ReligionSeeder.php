<?php

namespace Database\Seeders;

use App\Models\Religion;
use Illuminate\Database\Seeder;

class ReligionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $religions=[];
        $religions[] = [
            'id'=>1,
            'name'=>'Islam',
        ];
        Religion::insert($religions);
    }
}
