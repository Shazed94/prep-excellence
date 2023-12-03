<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseMaterialStoreRequest;
use App\Http\Requests\CourseMaterialUpdateRequest;
use App\Http\Resources\CourseMaterialCollection;
use App\Http\Resources\CourseMaterialResource;
use App\Models\CourseMaterial;
use App\Traits\FileUploadTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Monolog\Handler\IFTTTHandler;

class EmployeeCourseMaterialController extends Controller
{
    use FileUploadTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return CourseMaterialCollection
     */
    public function index(Request $request)
    {
        $emp = auth()->user()->userable;
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $materials = CourseMaterial::query();
        $materials->where('employee_id',$emp->id);
        if ($search) {
            $materials->whereLike(['course.name','course.batch','course.course_location','expire_date'], $search);
        }
        $materials=$materials->with(['course'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new CourseMaterialCollection($materials);
    }

    /**
     * @param \App\Http\Requests\CourseMaterialStoreRequest $request
     * @return \App\Http\Resources\CourseMaterialResource
     */
    public function store(CourseMaterialStoreRequest $request)
    {
        $emp = auth()->user()->userable;
        $data = $request->only(['course_id','expire_date']);
        $data +=[
            'employee_id'=>$emp->id,
            'type'=>1,
            'is_active'=>1
        ];
        if ($request->file('file')){
            $img = $this->uploadFile($request->file('file'),'courseMaterial');
            $data +=[
                'file'=>$img,
            ];
        }
        $courseMaterial = CourseMaterial::create($data);

        return new CourseMaterialResource($courseMaterial->load('course'));
    }

    /**
     * @param \App\Http\Requests\CourseMaterialUpdateRequest $request
     * @param \App\Models\CourseMaterial $courseMaterial
     * @return \App\Http\Resources\CourseMaterialResource
     */
    public function update(CourseMaterialUpdateRequest $request, CourseMaterial $courseMaterial)
    {
        $emp = auth()->user()->userable;
        $data = $request->only(['course_id','expire_date']);
        $data +=[
            'employee_id'=>$emp->id,
            'type'=>1,
        ];
        if ($request->file('file')){
            $img = $this->uploadFile($request->file('file'),'courseMaterial');
            $data +=[
                'file'=>$img,
            ];
        }
        $courseMaterial->update($data);

        return new CourseMaterialResource($courseMaterial->load('course'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\CourseMaterial $courseMaterial
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, CourseMaterial $courseMaterial)
    {
        $courseMaterial->delete();

        return response()->noContent();
    }

    public function toggle(CourseMaterial $courseMaterial): JsonResponse
    {
        try {
            $courseMaterial->update(['is_active' => !$courseMaterial->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
}
