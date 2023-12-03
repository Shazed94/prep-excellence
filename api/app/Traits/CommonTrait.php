<?php

namespace App\Traits;
use App\Models\Course;
use App\Models\Role;
use App\Models\Setting;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

trait CommonTrait
{

    /*
     * method for image upload
     * */
    protected function commonFields(Request $request): array
    {
        return [
            'ip' => $request->ip(),
            'browser' => $request->userAgent(),
            'created_by' => auth()->id() ?? null,
            'updated_by' => auth()->id() ?? null,
        ];
    }

    protected function storeMetadata(Request $request): array
    {
        return [
            'ip' => $request->ip(),
            'browser' => $request->userAgent(),
            'created_by' => auth()->id() ?? null,
        ];
    }

    protected function updateMetadata(Request $request): array
    {
        return [
            'updated_by' => auth()->id() ?? null,
        ];
    }
    protected function findStudentIds(): array
    {
        $user = auth()->user();
        if ($user->role_id == 4){
            $parents = $user->userable;
            return $parents->students->pluck('id')->toArray();
        }elseif ($user->role_id == 3){
            $std = auth()->user()->userable;
            return [$std->id];
        }
        return [0];
    }

    public function findChildIds()
    {
        $user = auth()->user();
        if ($user->role_id == 4){
            $parents = $user->userable;
            return $parents->students->pluck('id')->toArray();
        }
        return [0];
    }
    protected function findAdminRoles():array
    {
        return Role::where(['type'=>1])->pluck('id')->toArray();
    }
    protected function courseToEmployeeUser($course_id):array //only for employee user id
    {
        $ids=[];
        try {
            $course = Course::find($course_id);
            if (isset($course->id)){
                $employees = $course->employees;
                if (count($employees)){
                    foreach ($employees as $employee){
                        $user = $employee->userable;
                        if (isset($user->id)) $ids[]=$user->id;
                    }
                }
            }
        }catch (\Exception $e){
            //
        }
        return $ids;
    }
    protected function studentIdTOUser($student_id) //only for employee user id
    {
        $id=null;
        try {
            $student = Student::find($student_id);
            $user = $student->userable;
            if (isset($user->id)) $id = $user->id;
        }catch (\Exception $e){
            //
        }
        return $id;
    }

    protected function generalSettings($group,$name){
        return Setting::where(['group'=>$group, 'name'=>$name])->first();
    }

    protected function prepareMenu($array)
    {
        $return = [];
        //1
        krsort($array);
        foreach ($array as $k => &$item)
        {
            if (is_numeric($item['menu_item_id']))
            {
                $parent = $item['menu_item_id'];
                $parent_index = collect($array)->search(function($item) use ($parent) {
                    return $item['id'] == $parent;
                });
                if (empty($array[$parent_index]['children']))
                {
                    $array[$parent_index]['children'] = array();
                }
                //2
                array_unshift($array[$parent_index]['children'],$item);
                unset($array[$k]);
            }
        }
        //3
        ksort($array);
        return $array;
    }

    protected function prepareMenu2($array)
    {
        $return = [];
        //1
        krsort($array);
        foreach ($array as $k => &$item)
        {
            if (is_numeric($item['tutorial_category_id']))
            {
                $parent = $item['tutorial_category_id'];
                $parent_index = collect($array)->search(function($item) use ($parent) {
                    return $item['id'] == $parent;
                });
                if (empty($array[$parent_index]['children']))
                {
                    $array[$parent_index]['children'] = array();
                }
                //2
                array_unshift($array[$parent_index]['children'],$item);
                unset($array[$k]);
            }
        }
        //3
        ksort($array);
        return $array;
    }

    protected function prepareComment($array)
    {
        $return = [];
        //1
        krsort($array);
        foreach ($array as $k => &$item)
        {
            if (is_numeric($item['blog_comment_id']))
            {
                $parent = $item['blog_comment_id'];
                $parent_index = collect($array)->search(function($item) use ($parent) {
                    return $item['id'] == $parent;
                });
                if (empty($array[$parent_index]['children']))
                {
                    $array[$parent_index]['children'] = array();
                }
                //2
                array_unshift($array[$parent_index]['children'],$item);
                unset($array[$k]);
            }
        }
        //3
        ksort($array);
        return $array;
    }

    protected function buildMenu($array)
    {
        echo '<ul>';
        foreach ($array as $key=>$item)
        {
            echo '<li>';
            echo $item['name'];
            if (!empty($item['children']))
            {
                echo '..'.$item['id'];
                $this->buildMenu($item['children']);
            }
            echo '</li>';
        }
        echo '</ul>';
    }

    protected function findUserById($model){
        return isset($model->userable) ? $model->userable : null;
    }

    protected function bas64EncodePdf($question){

        $base_64=null;
        if ($question){
            if (File::exists(public_path($question))){
                $question = file_get_contents(public_path($question));
                if ($question !== false){
                    $base_64 = 'data:application/pdf;base64,'.base64_encode($question);
                }
            }

        }
        return $base_64;
    }

}
