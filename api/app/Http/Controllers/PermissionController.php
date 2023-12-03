<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionStoreRequest;
use App\Http\Requests\PermissionUpdateRequest;
use App\Http\Resources\PermissionCollection;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PermissionController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\PermissionCollection
     */
    public function index(Request $request)
    {
        $permissions = Permission::all();
        return new PermissionCollection($permissions);
    }

    /**
     * @param \App\Http\Requests\PermissionStoreRequest $request
     *
     */
    public function store(PermissionStoreRequest $request)
    {
        $restore_year = Permission::onlyTrashed()->where(['name'=>$request->name])->first();
        if(isset($restore_year->id)) $restore_data = $restore_year->restore();
        if (isset($restore_data)) return response()->json(['status'=>'success','message'=>'Successfully stored','data'=>$restore_year],200);
        $data = $request->except(['is_active']);
        Validator::make($request->all(),[
            'name'=>'unique:permissions,name'
        ])->validate();
        $data +=[
            'is_active'=>1,
        ];
        $request->validated();
        $permission = Permission::create($data);

        return new PermissionResource($permission);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Permission $permission
     * @return \App\Http\Resources\PermissionResource
     */
    public function show(Request $request, Permission $permission)
    {
        return new PermissionResource($permission);
    }

    /**
     * @param \App\Http\Requests\PermissionUpdateRequest $request
     * @param \App\Models\Permission $permission
     * @return \App\Http\Resources\PermissionResource
     */
    public function update(PermissionUpdateRequest $request, Permission $permission)
    {
        $permission->update($request->validated());

        return new PermissionResource($permission);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Permission $permission
     *
     */
    public function destroy(Request $request, Permission $permission)
    {
        $permission->delete();
        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Permission $permission): JsonResponse
    {
        try {
            $permission->update(['is_active' => !$permission->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
