<?php

namespace Database\Seeders;

use App\Models\AttendanceStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceStatusTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $statuses=[];
        $statuses[] = [
            'id'=>1,
            'name'=>'Absent',
        ];
        $statuses[] = [
            'id'=>2,
            'name'=>'Present'
        ];
        $statuses[] = [
            'id'=>3,
            'name'=>'Late Present'
        ];
        AttendanceStatus::insert($statuses);
    }
}
