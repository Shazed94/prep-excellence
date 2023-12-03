<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserUpdate2Request;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()->json(Auth::user());
    }
    /**
     * * @OA\Get(
     *   path="/api/user",
     *   summary="Get user",
     *   @OA\Response(
     *     response=200,
     *     description="Logged in user info"
     *   )
     * )
     */
    public function user(): \Illuminate\Http\JsonResponse
    {
        $user = auth()->user()->with([
            'role' => function ($q) {
                $q->select('id', 'name','type');
            },
            'userable'
        ])->where('id', auth()->id())->first();
        $permissions = $user->role->menuPermissions()->with(['menu', 'permission'])->get();
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
        if (isset($user->role->type)){
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
            'image' => $user->image,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'userable'=>$user->userable,
            'ability' => $abality,
        ];
        return response()->json($user,200);
    }

    public function userDetails(Request $request)
    {
        $user = auth()->user()->with([
            'role' => function ($q) {
                $q->select('id', 'name','type');
            },
            'userable'
        ])->where('id', auth()->id())->first();
        return response()->json($user,200);
    }
    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return UserResource
     */
    public function update(UserUpdate2Request $request)
    {
        $data = $request->validated();
        unset($data['image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'user/image/');
            $data +=[
                'image'=>$img
            ];
        }
        $user = auth()->user();
        $user->update($data);
        return new UserResource($user);
    }
    public function updatePassword(Request $request)
    {
        Validator::make($request->all(),[
            'password'=>'required|string|min:6|max:191'
        ])->validate();
        $user = Auth::user();
        try {
            $user->update(['password' => Hash::make($request->password)]);
            return response()->json(['status' => 'success', 'message'=> 'Password changed'], 200);
        } catch (\Exception $e){
            return response()->json(['status' => 'error', 'message'=> 'Invalid request'],200);
        }
    }
}
