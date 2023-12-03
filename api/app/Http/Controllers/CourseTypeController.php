<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseTypeStoreRequest;
use App\Http\Requests\CourseTypeUpdateRequest;
use App\Http\Resources\CourseTypeCollection;
use App\Http\Resources\CourseTypeResource;
use App\Models\CourseType;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseTypeController extends Controller
{
    use ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\CourseTypeCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $courseTypes = CourseType::query();
        if ($search) {
            $courseTypes->whereLike(['name','description'], $search);
        }
        return new CourseTypeCollection($courseTypes->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\CourseTypeStoreRequest $request
     *
     */
    public function store(CourseTypeStoreRequest $request)
    {
        $restore_year = CourseType::onlyTrashed()->where(['name'=>$request->name])->first();
        if(isset($restore_year->id)) $restore_data = $restore_year->restore();
        if (isset($restore_data)) return response()->json(['status'=>'success','message'=>'Successfully stored','data'=>$restore_year],200);

        Validator::make($request->all(),[
            'name'=>'unique:course_types,name',
        ])->validate();
        $request->validated();
        $data2 = $request->except(['is_active']);
        $data2 +=[
            'is_active'=>1,
        ];
        $courseType = CourseType::create($data2);
        //$courseType = CourseType::create($request->validated());

        return new CourseTypeResource($courseType);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseType $courseType
     * @return \App\Http\Resources\CourseTypeResource
     */
    public function show(Request $request, CourseType $courseType)
    {
        return new CourseTypeResource($courseType);
    }

    /**
     * @param \App\Http\Requests\CourseTypeUpdateRequest $request
     * @param \App\Models\CourseType $courseType
     * @return \App\Http\Resources\CourseTypeResource
     */
    public function update(CourseTypeUpdateRequest $request, CourseType $courseType)
    {
        $courseType->update($request->validated());

        return new CourseTypeResource($courseType);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseType $courseType
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, CourseType $courseType)
    {
        $courseType->delete();

        return response()->noContent();
    }

    public function toggle(CourseType $courseType): JsonResponse
    {
        try {
            $courseType->update(['is_active' => !$courseType->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function export(Request $request)
    {
        $cols = ['name', 'description','position','createdBy.name'];
        $headers = ['name', 'description','position','Created By'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('CourseType', $cols, $headers,$total,$where,$template);

    }
}
