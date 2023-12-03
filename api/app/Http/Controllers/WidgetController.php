<?php

namespace App\Http\Controllers;

use App\Http\Requests\WidgetStoreRequest;
use App\Http\Requests\WidgetUpdateRequest;
use App\Http\Resources\WidgetCollection;
use App\Http\Resources\WidgetResource;
use App\Models\Widget;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class WidgetController extends Controller
{
    use ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\WidgetCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $widgets = Widget::query();
        if ($search) {
            $widgets->whereLike(['title'], $search);
        }
        return new WidgetCollection($widgets->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\WidgetStoreRequest $request
     * @return \App\Http\Resources\WidgetResource
     */
    public function store(WidgetStoreRequest $request)
    {
        $widget = Widget::create($request->validated());
        Cache::forget('widgets');
        return new WidgetResource($widget);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Widget $widget
     * @return \App\Http\Resources\WidgetResource
     */
    public function show(Request $request, Widget $widget)
    {
        return new WidgetResource($widget);
    }

    /**
     * @param \App\Http\Requests\WidgetUpdateRequest $request
     * @param \App\Models\Widget $widget
     * @return \App\Http\Resources\WidgetResource
     */
    public function update(WidgetUpdateRequest $request, Widget $widget)
    {
        $widget->update($request->validated());
        Cache::forget('widgets');
        return new WidgetResource($widget);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Widget $widget
     * @return JsonResponse
     */
    public function destroy(Request $request, Widget $widget)
    {
        $widget->delete();
        Cache::forget('widgets');
        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Widget $widget): JsonResponse
    {
        try {
            $widget->update(['status' => !$widget->status]);
            Cache::forget('widgets');
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
    public function export(Request $request)
    {
        $cols = ['placement', 'title','type','position','status'];
        $headers = ['placement', 'title','type', 'position','status'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Widget', $cols, $headers,$total,$where,$template);

    }
}
