<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $menus = array(
            array('id' => '1','name' => 'Blog','alias' => 'Blog','type' => '1','is_active' => '1',),
            array('id' => '2','name' => 'Blog Category','alias' => 'Blog Category','type' => '1','is_active' => '1'),
            array('id' => '3','name' => 'Slider','alias' => 'Slider','type' => '1','is_active' => '1'),
            array('id' => '4','name' => 'Promotion','alias' => 'Promotion','type' => '1','is_active' => '1'),
            array('id' => '5','name' => 'Home Section','alias' => 'Home Section','type' => '1','is_active' => '1'),
            array('id' => '6','name' => 'Gallery','alias' => 'Gallery','type' => '1','is_active' => '1'),
            array('id' => '7','name' => 'Gallery Category','alias' => 'Gallery Category','type' => '1','is_active' => '1'),
            array('id' => '8','name' => 'Web Information','alias' => 'Web Information','type' => '1','is_active' => '1'),
            array('id' => '9','name' => 'Logo & Favicon','alias' => 'Logo & Favicon','type' => '1','is_active' => '1'),
            array('id' => '10','name' => 'Social Link','alias' => 'Social Link','type' => '1','is_active' => '1'),
            array('id' => '11','name' => 'Top Add','alias' => 'Top Add','type' => '1','is_active' => '1'),
            array('id' => '12','name' => 'Page','alias' => 'Page','type' => '1','is_active' => '1'),
            array('id' => '13','name' => 'Menu','alias' => 'Menu','type' => '1','is_active' => '1'),
            array('id' => '14','name' => 'Footer Widgets','alias' => 'Footer Widgets','type' => '1','is_active' => '1'),
            array('id' => '15','name' => 'Testimonial','alias' => 'Testimonial','type' => '1','is_active' => '1'),
            array('id' => '16','name' => 'Faqs','alias' => 'Faqs','type' => '1','is_active' => '1'),
            array('id' => '17','name' => 'Contact Form Request','alias' => 'Contact Form Request','type' => '1','is_active' => '1')
        );
        Menu::insert($menus);
    }
}
