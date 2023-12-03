<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserPermissionStoreRequest;
use App\Http\Requests\UserPermissionUpdateRequest;
use App\Http\Resources\UserPermissionCollection;
use App\Http\Resources\UserPermissionResource;
use App\Models\UserMenuPermission;
use Illuminate\Http\Request;

class UserPermissionController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\UserPermissionCollection
     */
    public function index(Request $request)
    {
        $userPermissions = UserMenuPermission::all();

        return new UserPermissionCollection($userPermissions);
    }

    /**
     * @param \App\Http\Requests\UserPermissionStoreRequest $request
     * @return \App\Http\Resources\UserPermissionResource
     */
    public function store(UserPermissionStoreRequest $request)
    {
        $userPermission = UserMenuPermission::create($request->validated());

        return new UserPermissionResource($userPermission);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\UserMenuPermission $userPermission
     * @return \App\Http\Resources\UserPermissionResource
     */
    public function show(Request $request, UserMenuPermission $userPermission)
    {
        return new UserPermissionResource($userPermission);
    }

    /**
     * @param \App\Http\Requests\UserPermissionUpdateRequest $request
     * @param \App\Models\UserMenuPermission $userPermission
     * @return \App\Http\Resources\UserPermissionResource
     */
    public function update(UserPermissionUpdateRequest $request, UserMenuPermission $userPermission)
    {
        $userPermission->update($request->validated());

        return new UserPermissionResource($userPermission);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\UserMenuPermission $userPermission
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, UserMenuPermission $userPermission)
    {
        $userPermission->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }
}
