<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'id'=>1,
            'role_id'=>1,
            'first_name'=>'Admin',
            'last_name'=>'Admin',
            'userable_type'=>'App\Models\Employee',
            'userable_id'=>1,
            'email'=>'admin@email.com',
            'password'=>Hash::make('password'),
        ]);
        Employee::create([
            'id'=>1,
            'emergency_contact'=>'3243214323',
        ]);
    }
}
