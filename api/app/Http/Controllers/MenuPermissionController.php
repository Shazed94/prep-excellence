<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuPermissionStoreRequest;
use App\Http\Requests\MenuPermissionUpdateRequest;
use App\Http\Resources\MenuPermissionCollection;
use App\Http\Resources\MenuPermissionResource;
use App\Models\Menu;
use App\Models\MenuPermission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuPermissionController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $permissions = Menu::with('permissions')->get();

        return response()->json(['data'=>$permissions],200);
    }

    public function update(Request $request, Role $role)
    {
        Validator::make($request->all(),[
            'permissions'=>'required|exists:menu_permissions,id',
        ])->validate();
        $ss = $role->menuPermissions()->sync($request->permissions);
        if (isset($ss)) return response()->json(['status'=>'success','message'=>'Successfully Saved'],200);
        return response()->json(['status'=>'error','message'=>'Invalid request'],404);
    }

    /*
     * method for update user menu permission
     * */
    public function userPermissionUpdate(User $user, Request $request)
    {
        //abort_if(Gate::denies('role_update'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        /*request data validate*/
        $data = Validator::make($request->all(),[
            'permissions'=>'nullable|not_in:0|exists:menu_permissions,id',
        ])->validate();
        if (isset($data['permissions']) && count($data['permissions'])) $ss = $user->menuPermissions()->sync($data['permissions']);
        else $ss = $user->menuPermissions()->sync([]);
        if (isset($ss)) return response()->json(['status'=>'success','message'=>'Successfully Saved'],200);
        return response()->json(['status'=>'error','message'=>'Invalid request'],404);
    }
}
