<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleMenuPermissionStoreRequest;
use App\Http\Requests\RoleMenuPermissionUpdateRequest;
use App\Http\Resources\RoleMenuPermissionCollection;
use App\Http\Resources\RoleMenuPermissionResource;
use App\Models\RoleMenuPermission;
use Illuminate\Http\Request;

class RoleMenuPermissionController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\RoleMenuPermissionCollection
     */
    public function index(Request $request)
    {
        $roleMenuPermissions = RoleMenuPermission::all();

        return new RoleMenuPermissionCollection($roleMenuPermissions);
    }

    /**
     * @param \App\Http\Requests\RoleMenuPermissionStoreRequest $request
     * @return \App\Http\Resources\RoleMenuPermissionResource
     */
    public function store(RoleMenuPermissionStoreRequest $request)
    {
        $roleMenuPermission = RoleMenuPermission::create($request->validated());

        return new RoleMenuPermissionResource($roleMenuPermission);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\RoleMenuPermission $roleMenuPermission
     * @return \App\Http\Resources\RoleMenuPermissionResource
     */
    public function show(Request $request, RoleMenuPermission $roleMenuPermission)
    {
        return new RoleMenuPermissionResource($roleMenuPermission);
    }

    /**
     * @param \App\Http\Requests\RoleMenuPermissionUpdateRequest $request
     * @param \App\Models\RoleMenuPermission $roleMenuPermission
     * @return \App\Http\Resources\RoleMenuPermissionResource
     */
    public function update(RoleMenuPermissionUpdateRequest $request, RoleMenuPermission $roleMenuPermission)
    {
        $roleMenuPermission->update($request->validated());

        return new RoleMenuPermissionResource($roleMenuPermission);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\RoleMenuPermission $roleMenuPermission
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, RoleMenuPermission $roleMenuPermission)
    {
        $roleMenuPermission->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }
}
