<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseCategoryStoreRequest;
use App\Http\Requests\CourseCategoryUpdateRequest;
use App\Http\Resources\CourseCategoryCollection;
use App\Http\Resources\CourseCategoryResource;
use App\Models\CourseCategory;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class CourseCategoryController extends Controller
{
    use ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseCategoryCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $courseCategories = CourseCategory::query();
        if ($search) {
            $courseCategories->whereLike(['name'], $search);
        }
        return new CourseCategoryCollection($courseCategories->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\CourseCategoryStoreRequest $request
     *
     */
    public function store(CourseCategoryStoreRequest $request)
    {
        $restore_year = CourseCategory::onlyTrashed()->where(['name'=>$request->name])->first();
        if(isset($restore_year->id)) $restore_data = $restore_year->restore();
        if (isset($restore_data)) return response()->json(['status'=>'success','message'=>'Successfully stored','data'=>$restore_year],200);

        Validator::make($request->all(),[
            'name'=>'unique:course_categories,name',
        ])->validate();
        $request->validated();
        $data2 = $request->except(['is_active','image']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'courseCategory/');
            $data2 +=[
                'image'=>$img
            ];
        }
        $data2 +=[
            'is_active'=>1,
        ];
        $courseCategory = CourseCategory::create($data2);
        //$courseCategory = CourseCategory::create($request->validated());
        Cache::forget('course_categories');
        return new CourseCategoryResource($courseCategory);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseCategory $courseCategory
     * @return \App\Http\Resources\CourseCategoryResource
     */
    public function show(Request $request, CourseCategory $courseCategory)
    {
        return new CourseCategoryResource($courseCategory);
    }

    /**
     * @param \App\Http\Requests\CourseCategoryUpdateRequest $request
     * @param \App\Models\CourseCategory $courseCategory
     * @return \App\Http\Resources\CourseCategoryResource
     */
    public function update(CourseCategoryUpdateRequest $request, CourseCategory $courseCategory)
    {
        $data = $request->only(['name']);
        if ($request->file('image')){
            $img = $this->uploadPhoto($request->file('image'),'courseCategory/');
            $data +=[
                'image'=>$img
            ];
        }
        $courseCategory->update($data);
        Cache::forget('course_categories');
        return new CourseCategoryResource($courseCategory);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseCategory $courseCategory
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, CourseCategory $courseCategory)
    {
        $courseCategory->delete();
        Cache::forget('course_categories');
        return response()->noContent();
    }

    public function toggle(CourseCategory $courseCategory): JsonResponse
    {
        try {
            $courseCategory->update(['is_active' => !$courseCategory->is_active]);
            Cache::forget('course_categories');
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['image', 'name','image','position'];
        $headers = ['Image', 'name','image','position'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('CourseCategory', $cols, $headers,$total,$where,$template);

    }
}
