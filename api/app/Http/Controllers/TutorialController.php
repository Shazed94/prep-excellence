<?php

namespace App\Http\Controllers;

use App\Http\Requests\TutorialStoreRequest;
use App\Http\Requests\TutorialUpdateRequest;
use App\Http\Resources\TutorialCollection;
use App\Http\Resources\TutorialResource;
use App\Models\Tutorial;
use App\Traits\CommonTrait;
use Illuminate\Http\Request;

class TutorialController extends Controller
{
    use CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\TutorialCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $blogs = Tutorial::query();
        if ($search) {
            $blogs->whereLike(['title','description'], $search);
        }
        $blogs = $blogs->with(['tutorialCategory'])->orderBy('id','DESC')->paginate($itemsPerPage);

        return new TutorialCollection($blogs);
    }

    /**
     * @param \App\Http\Requests\TutorialStoreRequest $request
     * @return \App\Http\Resources\TutorialResource
     */
    public function store(TutorialStoreRequest $request)
    {
        $tutorial = Tutorial::create($request->validated()+$this->storeMetadata($request));

        return new TutorialResource($tutorial);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Tutorial $tutorial
     * @return \App\Http\Resources\TutorialResource
     */
    public function show(Request $request, Tutorial $tutorial)
    {
        return new TutorialResource($tutorial);
    }

    /**
     * @param \App\Http\Requests\TutorialUpdateRequest $request
     * @param \App\Models\Tutorial $tutorial
     * @return \App\Http\Resources\TutorialResource
     */
    public function update(TutorialUpdateRequest $request, Tutorial $tutorial)
    {
        $tutorial->update($request->validated()+$this->updateMetadata($request));

        return new TutorialResource($tutorial);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Tutorial $tutorial
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Tutorial $tutorial)
    {
        $tutorial->delete();

        return response()->noContent();
    }

    public function toggle(Tutorial $tutorial)
    {
        try {
            $tutorial->update(['is_active' => !$tutorial->is_active]);
            return response()->json(['status' => 'success', 'message' => 'Status changed'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
