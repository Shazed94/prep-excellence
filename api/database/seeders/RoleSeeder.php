<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data[] =[
          'id'=>1,
            'type'=>1,
          'name'=>'Super Admin'
        ];
        $data[] =[
            'id'=>2,
            'type'=>2,
            'name'=>'Employee'
        ];
        $data[] =[
            'id'=>3,
            'type'=>3,
            'name'=>'Student'
        ];
        $data[] =[
            'id'=>4,
            'type'=>4,
            'name'=>'parent'
        ];
        $data[] =[
            'id'=>5,
            'type'=>5,
            'name'=>'Affiliation'
        ];
        Role::insert($data);
    }
}
