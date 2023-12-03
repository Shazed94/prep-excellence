<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuItemStoreRequest;
use App\Http\Requests\MenuItemUpdateRequest;
use App\Http\Resources\MenuItemCollection;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use App\Models\PMenu;
use App\Traits\CommonTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class MenuItemController extends Controller
{
    use CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\MenuItemCollection
     */
    public function index(Request $request)
    {
        $menuItems = MenuItem::all();

        return new MenuItemCollection($menuItems);
    }

    /**
     * @param \App\Http\Requests\MenuItemStoreRequest $request
     * @return JsonResponse
     */
    public function store(MenuItemStoreRequest $request)
    {
        if($request->relation_with == 'custom_link'){
            Validator::make($request->all(),[
                'url' => 'required|max:255',
                'name' => 'required|max:255'
            ])->validate();
        }else{
            Validator::make($request->all(),[
                'relation_with' => 'required',
                'relation_id' => 'required'
            ])->validate();
        }
        if($request->relation_with == 'custom_link') {
            $menuItem = MenuItem::create($request->validated());
        }else{
            $data=[];
            foreach ($request->relation_id as $id){
                $data[]=[
                    'p_menu_id'=>$request->p_menu_id,
                    'relation_id'=>$id,
                    'relation_with'=>'page',
                    'created_at'=>now(),
                    'updated_at'=>now(),
                ];
            }
            MenuItem::insert($data);
        }
        Cache::forget('menus');
        return response()->json(['status'=>'success','message'=>'Successfully added items'],200);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\MenuItem $menuItem
     * @return \App\Http\Resources\MenuItemResource
     */
    public function show(Request $request, MenuItem $menuItem)
    {
        return new MenuItemResource($menuItem);
    }

    /**
     * @param \App\Http\Requests\MenuItemUpdateRequest $request
     * @param \App\Models\MenuItem $menuItem
     * @return \App\Http\Resources\MenuItemResource
     */
    public function update(MenuItemUpdateRequest $request, MenuItem $menuItem)
    {
        if($request->relation_with == 'custom_link'){
            Validator::make($request->all(),[
                'url' => 'required|max:255',
                'name' => 'required|max:255'
            ])->validate();
        }else{
            Validator::make($request->all(),[
                'relation_with' => 'required',
                'relation_id' => 'required'
            ])->validate();
        }
        $menuItem->update($request->validated());
        Cache::forget('menus');
        return new MenuItemResource($menuItem);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\MenuItem $menuItem
     * @return JsonResponse
     */
    public function destroy(Request $request, MenuItem $menuItem)
    {
        if($menuItem->menuItem()->count()) return response()->json(['status'=>'error','message'=>'This menu has child you can\'t remove this'],200);
        else $menuItem->delete();
        Cache::forget('menus');
        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(MenuItem $menuItem): JsonResponse
    {
        try {
            $menuItem->update(['is_active' => !$menuItem->is_active]);
            Cache::forget('menus');
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function findMenuList(Request $request, PMenu $PMenu)
    {
        $menu = MenuItem::where(['p_menu_id'=>$PMenu->id])->get([
            'id', 'p_menu_id', 'name', 'url', 'relation_id', 'relation_with', 'menu_item_id', 'position'
        ])->toArray();
        $menus = $this->prepareMenu($menu);
        //return new MenuItemCollection($menus);
        $tt=[];
        foreach ($menus as $mn){
            $tt[]=$mn;
        }
        return response()->json($tt,200);
    }

    public function menuItemRearrange(Request $request)
    {
        Validator::make($request->all(),[
            'menus'=>'required'
        ])->validate();
        $menus = json_decode($request->menus,false);

        foreach ($menus as $item)
        {
            try {
                MenuItem::find($item->id)->update(['menu_item_id'=>$item->parent,'position'=>$item->position]);
            }catch (\Exception $e){
                //
            }
        }
        Cache::forget('menus');
        return response()->json(['status'=>'success','message'=>'Successfully updated']);
    }
}
