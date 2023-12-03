<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuStoreRequest;
use App\Http\Requests\MenuUpdateRequest;
use App\Http\Resources\MenuCollection;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\MenuCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $menus = Menu::query();
        if ($search) {
            $menus->whereLike(['name','alias'], $search);
        }
        $menus = $menus->with(['permissions'])->orderBy('id','DESC')->get();
        return new MenuCollection($menus);
    }

    /**
     * @param \App\Http\Requests\MenuStoreRequest $request
     *
     */
    public function store(MenuStoreRequest $request)
    {
        $data = $request->validated();

        $restore_year = Menu::onlyTrashed()->with(['permissions'])->where(['name'=>$data['name'],'type'=>$data['type']])->first();
        if(isset($restore_year->id)) $restore_data = $restore_year->restore();
        if (isset($restore_data)) return response()->json(['status'=>'success','message'=>'Successfully stored','data'=> new MenuResource($restore_year->load('permissions'))],200);

        $exist = Menu::where(['name'=>$data['name'],'type'=>$data['type']])->first();
        if (isset($exist->id)) return response()->json(['status'=>'error','message'=>'Already exists'],404);

        $data2 = $request->except(['is_active']);
        $data2 +=[
            'is_active'=>1,
        ];
        $menu = Menu::create($data2);
        try {
            $menu->permissions()->sync($request->permission_ids);
        }catch (\Exception $e){
            //
        }

        return new MenuResource($menu->load('permissions'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Menu $menu
     * @return \App\Http\Resources\MenuResource
     */
    public function show(Request $request, Menu $menu)
    {
        return new MenuResource($menu);
    }

    /**
     * @param \App\Http\Requests\MenuUpdateRequest $request
     * @param \App\Models\Menu $menu
     *
     */
    public function update(MenuUpdateRequest $request, Menu $menu)
    {
        $data = $request->validated();
        $exist = Menu::where('id','!=',$menu->id)->where(['name'=>$data['name'],'type'=>$data['type']])->first();
        if (isset($exist->id)) return response()->json(['status'=>'error','message'=>'Already exists'],404);

        $menu->update($data);
        //$data = explode(",",$request->permission_ids);
        $menu->permissions()->sync($request->permission_ids);
        return new MenuResource($menu->load('permissions'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Menu $menu
     *
     */
    public function destroy(Request $request, Menu $menu)
    {
        try {
            $menu->delete();
            return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
        }catch (\Exception $e){
            return response()->json(['status'=>'error','message'=>'Invalid request'],404);
        }
    }

    public function toggle(Menu $menu): JsonResponse
    {
        try {
            $menu->update(['is_active' => !$menu->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
