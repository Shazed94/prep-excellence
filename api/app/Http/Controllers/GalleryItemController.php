<?php

namespace App\Http\Controllers;

use App\Http\Requests\GalleryItemStoreRequest;
use App\Http\Requests\GalleryItemUpdateRequest;
use App\Http\Resources\GalleryItemCollection;
use App\Http\Resources\GalleryItemResource;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryItemController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\GalleryItemCollection
     */
    public function index(Request $request)
    {
        $galleryItems = GalleryItem::all();

        return new GalleryItemCollection($galleryItems);
    }

    /**
     * @param \App\Http\Requests\GalleryItemStoreRequest $request
     * @return \App\Http\Resources\GalleryItemResource
     */
    public function store(GalleryItemStoreRequest $request)
    {
        $galleryItem = GalleryItem::create($request->validated());

        return new GalleryItemResource($galleryItem);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\GalleryItem $galleryItem
     * @return \App\Http\Resources\GalleryItemResource
     */
    public function show(Request $request, GalleryItem $galleryItem)
    {
        return new GalleryItemResource($galleryItem);
    }

    /**
     * @param \App\Http\Requests\GalleryItemUpdateRequest $request
     * @param \App\Models\GalleryItem $galleryItem
     * @return \App\Http\Resources\GalleryItemResource
     */
    public function update(GalleryItemUpdateRequest $request, GalleryItem $galleryItem)
    {
        $galleryItem->update($request->validated());

        return new GalleryItemResource($galleryItem);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\GalleryItem $galleryItem
     * @return JsonResponse
     */
    public function destroy(Request $request, GalleryItem $galleryItem)
    {
        $galleryItem->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(GalleryItem $galleryItem): JsonResponse
    {
        try {
            $galleryItem->update(['is_active' => !$galleryItem->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
