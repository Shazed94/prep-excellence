<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleStoreRequest;
use App\Http\Requests\RoleUpdateRequest;
use App\Http\Resources\RoleCollection;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\RoleCollection
     */
    public function index(Request $request)
    {
        $roles = Role::with(['menuPermissions'])->get();

        return new RoleCollection($roles);
    }

    /**
     * @param \App\Http\Requests\RoleStoreRequest $request
     *
     */
    public function store(RoleStoreRequest $request)
    {
        $restore_year = Role::onlyTrashed()->with(['menuPermissions'])->where(['name'=>$request->name, 'type'=>$request->type])->first();
        if(isset($restore_year->id)) $restore_data = $restore_year->restore();
        if (isset($restore_data)) return response()->json(['status'=>'success','message'=>'Successfully stored','data'=>$restore_year],200);
        $request->validated();
        Validator::make($request->all(),[
            'name'=>'unique:roles,name',
        ])->validate();
        $data = $request->except(['is_active']);
        $data +=[
            'is_active'=>1,
        ];
        $role = Role::create($data);

        return new RoleResource($role->load('menuPermissions'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Role $role
     * @return \App\Http\Resources\RoleResource
     */
    public function show(Request $request, Role $role)
    {
        return new RoleResource($role->load('menuPermissions'));
    }

    /**
     * @param \App\Http\Requests\RoleUpdateRequest $request
     * @param \App\Models\Role $role
     *
     */
    public function update(RoleUpdateRequest $request, Role $role)
    {
        $chk = Role::where('id','!=',$role->id)->where(['name'=>$request->name,'type'=>$request->type])->first();
        if (isset($chk->id)) return response()->json(['status'=>'error','message'=>'Already exist this'],404);
        $role->update($request->validated());
        return new RoleResource($role->load('menuPermissions'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Role $role
     */
    public function destroy(Request $request, Role $role)
    {
        if ($role->users()->count()) return response()->json(['status'=>'error','message'=>'You can\'t remove this because already used'],404);
        try {
            $role->delete();
            return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>'Invalid request'],404);
        }

    }

    public function toggle(Role $role): JsonResponse
    {
        try {
            $role->update(['is_active' => !$role->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
