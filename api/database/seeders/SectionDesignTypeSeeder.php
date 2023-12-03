<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SectionDesignTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('section_design_types')->insert(
            [
                'id'=>1,
                'name'=>"Text Image Card",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>2,
                'name'=>"News",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>3,
                'name'=>"Testimonial",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>4,
                'name'=>"Half Parallax",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>5,
                'name'=>"Full Parallax",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>6,
                'name'=>"Courses",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>7,
                'name'=>"Promotions",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>8,
                'name'=>"Instructors",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>9,
                'name'=>"Gallery",
            ]
        );
        DB::table('section_design_types')->insert(
            [
                'id'=>10,
                'name'=>"Top Categories",
            ]
        );
    }
}
