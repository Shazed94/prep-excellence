<?php

namespace App\Traits;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

trait SatTrait
{

    /*
     * method for get question qualities
     * */
    protected function questionQualities(): array
    {
        return [
            ['id'=>1,'name'=>'Easy', 'symbol'=>''],
            ['id'=>2, 'name'=>'Medium', 'symbol'=>''],
            ['id'=>3, 'name'=>'Hard', 'symbol'=>''],
        ];
    }

    /*
     * method for get question qualities
     * */
    protected function sat_keys(): array
    {
        return [
            ['id'=>1,'name'=>'Correct', 'symbol'=>'✓'],
            ['id'=>2, 'name'=>'Multiple Response', 'symbol'=>'X'],
            ['id'=>3, 'name'=>'Omitted', 'symbol'=>'O'],
            ['id'=>4, 'name'=>'Unscoreable', 'symbol'=>'U'],
        ];
    }

    protected function all_keys(): array
    {
        return [
            ['name'=>'Easy', 'symbol'=>''],
            ['name'=>'Medium', 'symbol'=>''],
            ['name'=>'Hard', 'symbol'=>''],
            ['name'=>'Correct', 'symbol'=>'✓'],
            ['name'=>'Multiple Response', 'symbol'=>'X'],
            ['name'=>'Omitted', 'symbol'=>'O'],
            ['name'=>'Unscoreable', 'symbol'=>'U'],
        ];
    }

    /*
     * method for get question qualities
     * */
    protected function subScores(): array
    {
        return [
            ['id'=>1,'short_name'=>'COE', 'name'=>'Command of Evidence'],
            ['id'=>2, 'short_name'=>'WIC', 'name'=>'Words in Contest'],
            ['id'=>3, 'short_name'=>'EOI', 'name'=>'Expression of Ideas'],
            ['id'=>4, 'short_name'=>'SEC', 'name'=>'Standard English Convention'],
            ['id'=>5, 'short_name'=>'HOA', 'name'=>'Hart of Algebra'],
            ['id'=>6, 'short_name'=>'PSD', 'name'=>'Problem Solving and Data Analysis'],
            ['id'=>7, 'short_name'=>'PAM', 'name'=>'Passport to Advanced Math'],
        ];
    }

    /*
     * method for get question qualities
     * */
    protected function crossTestScore(): array
    {
        return [
            ['id'=>1,'short_name'=>'HSS', 'name'=>'Analysis in History Social Studies'],
            ['id'=>2, 'short_name'=>'SCI', 'name'=>'Analysis in Science'],
        ];
    }

    /*
     * method for get question qualities
     * */
    protected function satExams(): array
    {
        return [
            ['id'=>1,'short_name'=>'Section 1', 'name'=>'Reading'],
            ['id'=>2, 'short_name'=>'Section 2', 'name'=>'Writing and Language'],
            ['id'=>3, 'short_name'=>'Section 3', 'name'=>'Math Test - Calculator'],
            ['id'=>4, 'short_name'=>'Section 4', 'name'=>'Math Test -No Calculator'],
        ];
    }
}
