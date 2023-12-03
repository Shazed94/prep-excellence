<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = array(
            array('id' => '1','name' => 'read','alias' => 'Read','is_active' => '1'),
            array('id' => '2','name' => 'create','alias' => 'create','is_active' => '1'),
            array('id' => '3','name' => 'edit','alias' => 'edit','is_active' => '1'),
            array('id' => '4','name' => 'remove','alias' => 'remove','is_active' => '1',),
            array('id' => '5','name' => 'status change','alias' => 'status change','is_active' => '1',)
        );
        Permission::Insert($permissions);
    }
}
