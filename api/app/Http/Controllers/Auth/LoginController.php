<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use App\Models\PreUser;
use App\Models\Student;
use App\Models\Parents;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Notifications\EmailVerificationMail;


class LoginController extends Controller
{
    use FileUploadTrait;
    public function register(Request $request)
    {
        Validator::make($request->all(),[
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|max:191'
        ])->validate();

        $user = new PreUser;
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->token = md5(time());

        $user->save();
        //
        try{
            $user->notify(new EmailVerificationMail($user->id, $user->token));
        }catch (\Exception $e){
            //
        }

        return response()->json(['status' => 'success', 'message' => 'Email verification link send successfully.']);
    }

    public function emailVerify($id)
    {
        $user = PreUser::findOrFail($id);

        return response()->json(['status' => 'success', 'user' => $user]);
    }

    public function resendVerifyLink($id)
    {
        $user = PreUser::findOrFail($id);
        $user->notify(new EmailVerificationMail($user->id));

        return response()->json(['status' => 'success', 'message' => 'Email verification link send successfully.'], );
    }

    public function emailVerifyCheck($id, $token)
    {
        $pre_user = PreUser::find($id);

        if(!$pre_user){
            return response()->json(['status' => 'error', 'message' => 'invalid']);
        }

        // check token
        if ($pre_user->token != $token) {
            return response()->json(['status' => 'error', 'message' => 'invalid']);
        }

        /*
         *existing student id find
         * */
        $check = Student::where('student_id', '!=', null)->latest('id')->first(['id','student_id']);

        if (isset($check->id)){
            $student_id = $check->student_id + 1;
        }else{
            $student_id = date('Y') . '0001';//generate student id
        }
        while (1){
            $emp = DB::table('students')->where(['student_id'=>$student_id])->where('student_id', '!=', null)->latest('id')->first();
            //$emp = Student::where(['student_id'=>$student_id])->where('student_id', '!=', null)->latest('id')->first();
            if(!isset($emp->id)) break;
            else{
                $student_id = $emp->student_id + 1;
            }
        }

        $student_data = [];
        $student_data +=['student_id'=>$student_id];
        $user_data = [
            'first_name' => $pre_user->first_name,
            'last_name' => $pre_user->last_name,
            'email' => $pre_user->email,
            'password' => $pre_user->password,
            'status' => 'verified',
            'role_id'=>3,
        ];
        DB::beginTransaction();
        try {
            $student = Student::create($student_data);
            $user =  $student->userable()->create($user_data);
            // Delete History
            DB::table('pre_users')->where('email', $pre_user->email)->delete();
            DB::commit();
            Auth::login($user);
            $accessToken = auth()->user()->createToken('authToken')->accessToken;
            $refreshToken = auth()->user()->createToken('refreshToken')->accessToken;

        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status'=>'error','message'=>'Can\'t create student try again'],404);
        }

        return response()->json(['status' => 'success', 'user' => $user, 'access_token' => $accessToken, 'refresh_token' => $refreshToken, 'message' => 'ok'], 200);
    }

    public function submitAllData(Request $request)
    {
        Validator::make($request->all(),[
            'phone_number'=>['required','string','max:30'],
            'gender_id'=>['not_in:0','exists:genders,id'],
            'blood_group_id'=>['not_in:0','exists:blood_groups,id'],
            'religion_id'=>['not_in:0','exists:religions,id'],
            'date_of_birth'=>['required','date'],
            'guardian_email' => ['nullable','email','max:60','unique:users,email'],
            'father_name'=>['max:191'],
            'father_phone_no'=>['max:30'],
            'mother_name'=>['max:191'],
            'present_address'=>[],
            'parmanent_address'=>[],
        ])->validate();
        $user_data= $request->only(['phone_number','gender_id','blood_group_id','religion_id']);
        if ($request->file('image')){
            $img = $this->uploadFile($request->file('image'),'student');
            $user_data +=[
                'image'=>$img,
            ];
        }
        $student_data = $request->only([ 'date_of_birth']);
        $user = auth()->user();
        DB::beginTransaction();
        try {
            $user->update($user_data);
            if (!$request->input('parent_id')){
                $parent_data = $request->only(['father_name',
                    'father_profession',
                    'father_phone_no',
                    'father_nid',
                    'mother_name',
                    'mother_profession',
                    'mother_phone_number',
                    'mother_nid',
                    'present_address',
                    'parmanent_address',
                    'local_guardian_name',
                    'local_guardian_phone',
                    'relation',
                    'address']);
                $age = Carbon::parse($request->date_of_birth)->diff(Carbon::now())->format('%y');
                $parent = Parents::create($parent_data);
                $student_data +=['parent_id'=>$parent->id];
                if ($age < 18){
                    $parent_user=[
                        'first_name'=>'Parent',
                        'email'=>$request->guardian_email,
                        'password'=>Hash::make(rand(111111,99999999)),
                        'role_id'=>4,//role 4 for student
                    ];
                    $parent->userable()->create($parent_user);
                }
            }else{
                $parent = Parents::find($request->input('parent_id'));
                $student_data +=['parent_id'=>$parent->id];
            }
            $user->userable()->update($student_data);
            DB::commit();
            return response()->json(['status'=>'success','message'=>"Successfully updated"],200);
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status'=>'error','message'=>'Invalid request'],404);
        }
    }

    /**
     * @OA\Post(
     *   path="/api/login",
     *   tags={"User login"},
     *   summary="Login",
     *   operationId="login",
     *
     *   @OA\Parameter(
     *      name="email",
     *      in="query",
     *      required=true,
     *      @OA\Schema(
     *           type="string"
     *      )
     *   ),
     *   @OA\Parameter(
     *      name="password",
     *      in="query",
     *      required=true,
     *      @OA\Schema(
     *          type="string"
     *      )
     *   ),
     *   @OA\Response(
     *      response=200,
     *       description="Success",
     *      @OA\MediaType(
     *           mediaType="application/json",
     *      )
     *   ),
     *      *   @OA\Response(
     *      response=401,
     *       description="Unauthenticated"
     *   ),
     *   @OA\Response(
     *      response=400,
     *      description="Bad Request"
     *   ),
     *   @OA\Response(
     *      response=404,
     *      description="not found"
     *   ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *)
     **/
    public function authentication(Request $request)
    {
        //print_r($request->all());
        Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required|min:6'
        ])->validate();

        if (!auth::attempt(['email' => $request->email, 'password' => $request->password, 'is_active' => 1])) {
            return response()->json(['status' => 'fail', 'message' => 'Incorrect Email or Password!'], 403);
        }
        $user = auth()->user();
        $role = $user->role;
        if (!$role || $role->type == 3 || $role->type == 4){
            return response()->json(['status' => 'fail', 'message' => 'Your credential is incorrect!'], 403);
        }
        $accessToken = $user->createToken('authToken')->accessToken;
        $refreshToken = $user->createToken('refreshToken')->accessToken;
        $permissions = $user->role ? $user->role->menuPermissions()->with(['menu', 'permission'])->get() : [];
        $permissions2 = $user->menuPermissions()->with(['menu', 'permission'])->get();
        $abality = [];
        foreach ($permissions as $permission) {
            $abality[] = [
                'action' => $permission->permission ? $permission->permission->name : '',
                'subject' => $permission->menu ? $permission->menu->name : '',
            ];
        }
        foreach ($permissions2 as $permission) {
            $abality[] = [
                'action' => $permission->permission ? $permission->permission->name : '',
                'subject' => $permission->menu ? $permission->menu->name : '',
            ];
        }
        /*just for now role permission*/
        if ($user->role->type){
            $subject = '';
            if ($user->role->type==1) $subject='Admin';
            else if ($user->role->type==2) $subject='Employee';
            else if ($user->role->type==3) $subject='Student';
            else if ($user->role->type==4) $subject='Parent';
            else if ($user->role->type==5) $subject='Affiliation';
            $abality[] = [
                'action' => 'read',
                'subject' => $subject,
            ];
        }

        $abality[] = [
            'action' => 'full',
            'subject' => 'Auth',
        ];
        $abality[] = [
            'action' => 'read',
            'subject' => 'Auth',
        ];
        $abality[] = [
            'action' => 'read',
            'subject' => 'Dashboard',
        ];
        $user = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'name' => $user->name,
            'role' => $user->role ? $user->role->name : '',
            'role_id' => $user->role_id,
            'email' => $user->email,
            'image' => $user->image,
            'userable'=>$user->userable,
            'ability' => $abality,
        ];
        if (isset($user)) {
            return response()->json(['status' => 'success', 'user' => $user, 'access_token' => $accessToken, 'refresh_token' => $refreshToken], 200);
        }
        return response()->json(['status' => 'fail', 'message' => 'Invalid Request'], 404);
    }

    /**
     * @OA\Post(
     *   path="/api/frontend/login",
     *   tags={"User login"},
     *   summary="Login",
     *   operationId="login",
     *
     *   @OA\Parameter(
     *      name="email",
     *      in="query",
     *      required=true,
     *      @OA\Schema(
     *           type="string"
     *      )
     *   ),
     *   @OA\Parameter(
     *      name="password",
     *      in="query",
     *      required=true,
     *      @OA\Schema(
     *          type="string"
     *      )
     *   ),
     *   @OA\Response(
     *      response=200,
     *       description="Success",
     *      @OA\MediaType(
     *           mediaType="application/json",
     *      )
     *   ),
     *      *   @OA\Response(
     *      response=401,
     *       description="Unauthenticated"
     *   ),
     *   @OA\Response(
     *      response=400,
     *      description="Bad Request"
     *   ),
     *   @OA\Response(
     *      response=404,
     *      description="not found"
     *   ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *)
     **/
    public function authentication2(Request $request)
    {
        //print_r($request->all());
        Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required|min:6'
        ])->validate();

        if (!auth::attempt(['email' => $request->email, 'password' => $request->password, 'is_active' => 1])) {
            return response()->json(['status' => 'fail', 'message' => 'Incorrect Email or Password!'], 403);
        }

        $user = auth()->user();
        $role = $user->role;
        //return response()->json(['status' => 'fail', 'message' => 'Your credential is incorrect!','data'=>$role], 403);
        if (($role->type < 3 || $role->type > 4)){
            return response()->json(['status' => 'fail', 'message' => 'Your credential is incorrect!'], 403);
        }
        $accessToken = $user->createToken('authToken')->accessToken;
        $refreshToken = $user->createToken('refreshToken')->accessToken;
        $abality = [];
        $user = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'name' => $user->name,
            'role' => $role ? $role->name : '',
            'role_id' => $user->role_id,
            'email' => $user->email,
            'image' => $user->image,
            'userable'=>$user->userable,
            'ability' => $abality,
        ];
        if (isset($user)) {
            return response()->json(['status' => 'success', 'user' => $user, 'access_token' => $accessToken, 'refresh_token' => $refreshToken], 200);
        }
        return response()->json(['status' => 'fail', 'message' => 'Invalid Request'], 404);
    }
}
