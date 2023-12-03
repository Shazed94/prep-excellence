<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Traits\EmailTrait;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;


class ForgotPasswordController extends Controller
{
    use EmailTrait;

    public function sendVerifyLink($email)
    {

        $user = User::where(['email'=>$email, 'is_active' => 1])->first();
        try {
            if (isset($user->id)){
                $token = rand(111111,999999);
                $message = "<p>Your password reset verification code is <b>$token</b></p>";
                DB::table('password_resets')->insert(['email'=>$email,'token'=>$token,'created_at'=>Carbon::now()->addMinutes(5),]);
                $this->passwordRestEmail($email,$message, $user->name);
                return response()->json(['data' => 'Verification code sent to your email', 'status' => 'success'],200);
            }
        }catch (\Exception $e){
            //
        }

        return response()->json(['message' => 'No account found with this email', 'status' => 'fail'],404);
    }

    public function verifyToken(Request $request)
    {
        $data = Validator::make($request->all(),[
            'email'=>'required|string|email',
            'token'=>'required|string|max:6',
        ])->validate();

        $ss = DB::table('password_resets')->where(['email'=>$data['email'],'token'=>$data['token']])
            ->where('created_at','>=', Carbon::now())->latest()->first();
        if (isset($ss->email) && $ss->token == $data['token']){
            $user = User::where(['email' => $data['email'], 'is_active' => 1])->first();
            $accessToken = uniqid();
            Cache::put("token_$user->id",['token'=>$accessToken,'user_id'=>$user->id]);
            return response()->json(['data' =>['token'=>$accessToken,'name'=>"token_$user->id"], 'status' => 'success'],200);
        }

        return response()->json(['message' => 'Invalid verification code', 'status' => 'fail'],404);
    }

    public function resetPassword(Request $request)
    {
        $data = Validator::make($request->all(),[
            'password'=>'required|string|max:191|confirmed',
            'token'=>'required|string|max:191',
            'name'=>'required|string|max:191',
        ])->validate();
        $password = Hash::make($data['password']);
        $token = Cache::get($data['name']);
        if ($token['token'] == $data['token']){
            try {
                User::where('id',$token['user_id'])->update(['password'=>$password]);
                Cache::forget($data['name']);
                return response()->json(['message' => 'Successfully update password', 'status' => 'success'],200);
            }catch (\Exception $e){
                //
            }
        }
        return response()->json(['message' => 'Invalid Request', 'status' => 'fail'],404);
    }
}
