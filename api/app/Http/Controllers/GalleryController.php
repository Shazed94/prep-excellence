<?php

namespace App\Http\Controllers;

use App\Http\Requests\GalleryStoreRequest;
use App\Http\Requests\GalleryUpdateRequest;
use App\Http\Resources\GalleryCollection;
use App\Http\Resources\GalleryResource;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\GalleryCollection
     */
    public function index(Request $request)
    {
        $galleries = Gallery::all();

        return new GalleryCollection($galleries);
    }

    /**
     * @param \App\Http\Requests\GalleryStoreRequest $request
     * @return \App\Http\Resources\GalleryResource
     */
    public function store(GalleryStoreRequest $request)
    {
        $gallery = Gallery::create($request->validated());

        return new GalleryResource($gallery);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Gallery $gallery
     * @return \App\Http\Resources\GalleryResource
     */
    public function show(Request $request, Gallery $gallery)
    {
        return new GalleryResource($gallery);
    }

    /**
     * @param \App\Http\Requests\GalleryUpdateRequest $request
     * @param \App\Models\Gallery $gallery
     * @return \App\Http\Resources\GalleryResource
     */
    public function update(GalleryUpdateRequest $request, Gallery $gallery)
    {
        $gallery->update($request->validated());

        return new GalleryResource($gallery);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Gallery $gallery
     * @return JsonResponse
     */
    public function destroy(Request $request, Gallery $gallery)
    {
        $gallery->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Gallery $gallery): JsonResponse
    {
        try {
            $gallery->update(['is_active' => !$gallery->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
