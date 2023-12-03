<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
         //\App\Models\User::factory(10)->create();
        Artisan::call('passport:install');
        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(SectionDesignTypeSeeder::class);
       	$this->call(BloodGroupSeeder::class);
        $this->call(GenderSeeder::class);
        $this->call(MaritalStatusSeeder::class);
        $this->call(ReligionSeeder::class);
        $this->call(DesignationSeeder::class);
        $this->call(PermissionTableSeeder::class);
        $this->call(MenuTableSeeder::class);
        $this->call(MenuPermissionSeeder::class);
        $this->call(AttendanceStatusTableSeeder::class);
    }
}
