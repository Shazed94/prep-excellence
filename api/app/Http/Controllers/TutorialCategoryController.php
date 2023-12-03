<?php

namespace App\Http\Controllers;

use App\Http\Requests\TutorialCategoryStoreRequest;
use App\Http\Requests\TutorialCategoryUpdateRequest;
use App\Http\Resources\TutorialCategoryCollection;
use App\Http\Resources\TutorialCategoryResource;
use App\Models\TutorialCategory;
use App\Traits\CommonTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TutorialCategoryController extends Controller
{
    use CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     */
    public function index(Request $request)
    {
        $tutorialCategories = TutorialCategory::Orderby('position','ASC')
            ->get(['id','title','tutorial_category_id','position']);

        return new TutorialCategoryCollection($tutorialCategories);
    }

    public function index2(Request $request)
    {
        $tutorialCategories = TutorialCategory::Orderby('position','ASC')->get(['id','title','tutorial_category_id','position'])->toArray();

        $tutorial_cats = $this->prepareMenu2($tutorialCategories);
        $tt=[];
        foreach ($tutorial_cats as $mn){
            $tt[]=$mn;
        }

        return response()->json(['data'=>$tt],200);
    }

    public function categoryWithTutorials(Request $request)
    {
        $tutorialCategories = TutorialCategory::with(['children'])->Orderby('position','ASC')->get(['id','title','tutorial_category_id','position'])->toArray();

        $tutorial_cats = $this->prepareMenu2($tutorialCategories);
        $tt=[];
        foreach ($tutorial_cats as $mn){
            $tt[]=$mn;
        }

        return response()->json(['data'=>$tt],200);
    }

    /**
     * @param \App\Http\Requests\TutorialCategoryStoreRequest $request
     * @return \App\Http\Resources\TutorialCategoryResource
     */
    public function store(TutorialCategoryStoreRequest $request)
    {
        $tutorialCategory = TutorialCategory::create($request->validated()+$this->updateMetadata($request));

        return new TutorialCategoryResource($tutorialCategory);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\TutorialCategory $tutorialCategory
     * @return \App\Http\Resources\TutorialCategoryResource
     */
    public function show(Request $request, TutorialCategory $tutorialCategory)
    {
        return new TutorialCategoryResource($tutorialCategory);
    }

    /**
     * @param \App\Http\Requests\TutorialCategoryUpdateRequest $request
     * @param \App\Models\TutorialCategory $tutorialCategory
     * @return \App\Http\Resources\TutorialCategoryResource
     */
    public function update(TutorialCategoryUpdateRequest $request, TutorialCategory $tutorialCategory)
    {
        $tutorialCategory->update($request->validated()+$this->updateMetadata($request));

        return new TutorialCategoryResource($tutorialCategory);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\TutorialCategory $tutorialCategory
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, TutorialCategory $tutorialCategory)
    {
        $tutorialCategory->delete();

        return response()->noContent();
    }

    public function toggle(TutorialCategory $tutorialCategory)
    {
        try {
            $tutorialCategory->update(['is_active' => !$tutorialCategory->is_active]);
            return response()->json(['status' => 'success', 'message' => 'Status changed'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function itemRearrange(Request $request)
    {
        $data = Validator::make($request->all(),[
            'items'=>'required|json'
        ])->validate();
        $menus = json_decode($data['items'],false);

        foreach ($menus as $item)
        {
            try {
                TutorialCategory::find($item->id)->update(['tutorial_category_id'=>$item->parent,'position'=>$item->position]);
            }catch (\Exception $e){
                //
            }
        }
        return response()->json(['status'=>'success','message'=>'Successfully updated']);
    }
}
