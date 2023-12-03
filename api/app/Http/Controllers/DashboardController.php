<?php

namespace App\Http\Controllers;

use App\Models\BlogComment;
use App\Models\Chat;
use App\Models\Course;
use App\Models\Employee;
use App\Models\Parents;
use App\Models\Student;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function report()
    {
        $chats = Chat::query();
        $comments = BlogComment::query();
        $report = [
            //'total_user' => $this->permissionCheck('user','Dashboard') ? User::count() ?? 0:0,
            'total_student' => Student::count(),
            'total_parent' => Parents::count(),
            'total_employee' => Employee::count(),
            'total_course' => Course::count(),
            'total_message'=>$chats->where(['receiver_id'=>auth()->id(),'is_seen'=>0])->count(),
            'total_comments'=>$comments->count(),
            'pending_comments'=>$comments->where('status','Pending')->count(),
        ];
        return response()->json(['status'=>'success', 'data'=>$report], 200);
    }
}
