<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ChangePasswordController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @param
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['auth']);
    }
    /*
     * methods for forget password
     * */
    public function changePassword(Request $request){
        Validator::make($request->all(),[
            'old_password'=>'required|max:191',
            'password'=>'required|confirmed|min:6|max:191'
        ])->validate();
        $hashpassword = auth()->user()->password;

        if(Hash::check($request->old_password, $hashpassword)){
            if (!Hash::check($request->password,$hashpassword)){
                $user = User::find(auth()->id());
                $user->password = Hash::make($request->password);
                $user->save();
                $msg = "Success ! Password has been changed successfully.";
                return response()->json(['status'=>'success','message'=>$msg],200);

            }else{
                $msg ="Error! New password cannot be the same as old password";
                return response()->json(['status'=>'error','message'=>$msg],200);
            }
        }else{
            $msg ="Error! old password not match!!";
            return response()->json(['status'=>'error','message'=>$msg],200);
        }
    }
}
