<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\HomeWorkStoreRequest;
use App\Http\Requests\HomeWorkUpdateRequest;
use App\Http\Resources\HomeWorkCollection;
use App\Http\Resources\HomeWorkResource;
use App\Models\CourseMaterial;
use App\Models\HomeWork;
use App\Models\StudentHomeWork;
use App\Traits\FileUploadTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeHomeWorkController extends Controller
{
    use FileUploadTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return HomeWorkCollection
     */
    public function index(Request $request)
    {
        $emp = auth()->user()->userable;
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $materials = HomeWork::query();
        $materials->where('employee_id',$emp->id);
        if ($search) {
            $materials->whereLike(['course.name','course.batch'], $search);
        }
        $materials=$materials->with(['course','studentHomeWorks.student'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new HomeWorkCollection($materials);
    }

    /**
     * @param \App\Http\Requests\HomeWorkStoreRequest $request
     * @return \App\Http\Resources\HomeWorkResource
     */
    public function store(HomeWorkStoreRequest $request)
    {
        $emp = auth()->user()->userable;
        $data = $request->except(['file']);
        $data +=[
            'employee_id'=>$emp->id,
            'is_active'=>1
        ];
        if ($request->file('file')){
            $img = $this->uploadFile($request->file('file'),'courseMaterial');
            $data +=[
                'file'=>$img,
            ];
        }
        $courseMaterial = HomeWork::create($data);

        return new HomeWorkResource($courseMaterial->load('course','studentHomeWorks'));
    }

    /**
     * @param \App\Http\Requests\HomeWorkUpdateRequest $request
     * @param \App\Models\HomeWork $homeWork
     * @return \App\Http\Resources\HomeWorkResource
     */
    public function update(HomeWorkUpdateRequest $request, HomeWork $homeWork)
    {
        $emp = auth()->user()->userable;
        $data = $request->except(['file']);
        $data +=[
            'employee_id'=>$emp->id,
        ];
        if ($request->file('file')){
            $img = $this->uploadFile($request->file('file'),'homeWork');
            $data +=[
                'file'=>$img,
            ];
        }
        $homeWork->update($data);

        return new HomeWorkResource($homeWork->load('course','studentHomeWorks'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\HomeWork $homeWork
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, HomeWork $homeWork)
    {
        $homeWork->delete();

        return response()->noContent();
    }

    public function toggle(HomeWork $homeWork): JsonResponse
    {
        try {
            $homeWork->update(['is_active' => !$homeWork->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function uploadMark(Request $request, StudentHomeWork $studentHomeWork)
    {
        $data = Validator::make($request->all(),[
            'mark'=>'required|numeric|min:0|max:'.$studentHomeWork->total_mark
        ])->validate();
        $emp = auth()->user()->userable;
        $studentHomeWork->update(['mark'=>$data['mark']]);
        return response()->json(['status'=>'success','message'=>'Successfully updated'],200);

    }
}
