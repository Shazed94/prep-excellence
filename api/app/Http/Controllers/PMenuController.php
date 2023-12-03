<?php

namespace App\Http\Controllers;

use App\Http\Requests\PMenuStoreRequest;
use App\Http\Requests\PMenuUpdateRequest;
use App\Http\Resources\PMenuCollection;
use App\Http\Resources\PMenuResource;
use App\Models\PMenu;
use App\Traits\CommonTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PMenuController extends Controller
{
    use CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\PMenuCollection
     */
    public function index(Request $request)
    {
        $pMenus = PMenu::all();

        return new PMenuCollection($pMenus);
    }

    /**
     * @param \App\Http\Requests\PMenuStoreRequest $request
     * @return \App\Http\Resources\PMenuResource
     */
    public function store(PMenuStoreRequest $request)
    {
        $pMenu = PMenu::create($request->validated());

        return new PMenuResource($pMenu);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\PMenu $pMenu
     * @return \App\Http\Resources\PMenuResource
     */
    public function show(Request $request, PMenu $pMenu)
    {
        return new PMenuResource($pMenu);
    }

    /**
     * @param \App\Http\Requests\PMenuUpdateRequest $request
     * @param \App\Models\PMenu $pMenu
     * @return \App\Http\Resources\PMenuResource
     */
    public function update(PMenuUpdateRequest $request, PMenu $pMenu)
    {
        $pMenu->update($request->validated());

        return new PMenuResource($pMenu);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\PMenu $pMenu
     * @return JsonResponse
     */
    public function destroy(Request $request, PMenu $pMenu)
    {
        $pMenu->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(PMenu $pMenu): JsonResponse
    {
        try {
            $pMenu->update(['status' => !$pMenu->status]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }


    public function menuArrange()
    {
        $menu = array(
            array(
                'id' => '1',
                'Order' => '1',
                'Name' => 'History',
                'menu_item_id' => '',
                'Path' => 'History',
                'Link' => '',
            ),
            array
            (
                'id' => '2',
                'Order' => '25',
                'Name' => 'Review',
                'menu_item_id' => '',
                'Path' => 'Review',
                'Link' => 'Review',
            ),
            array
            (
                'id' => '3',
                'Order' => '35',
                'Name' => 'Past Medical History',
                'menu_item_id' => '',
                'Path' => 'Past Medical History',
                'Link' => 'Past Medical History',
            ),
            array
            (
                'id' => '4',
                'Order' => '45',
                'Name' => 'Item 1',
                'menu_item_id' => '1',
                'Path' => 'Item 1',
                'Link' => 'Item 1',
            ),
            array
            (
                'id' => '5',
                'Order' => '55',
                'Name' => 'Item 2',
                'menu_item_id' => '4',
                'Path' => 'Item 2',
                'Link' => 'Item 2',
            ),
            array
            (
                'id' => '6',
                'Order' => '65',
                'Name' => 'Item 3',
                'menu_item_id' => '1',
                'Path' => 'Item 3',
                'Link' => 'Item 3',
            ),
            array
            (
                'id' => '7',
                'Order' => '65',
                'Name' => 'Item 31',
                'menu_item_id' => '5',
                'Path' => 'Item 31',
                'Link' => 'Item 31',
            )
        );
        $menu = $this->prepareMenu($menu);
        $this->buildMenu($menu);
    }
}
