<?php

namespace App\Http\Controllers;

use App\Http\Requests\ParentStoreRequest;
use App\Http\Requests\ParentUpdateRequest;
use App\Http\Resources\ParentCollection;
use App\Http\Resources\ParentResource;
use App\Models\Parents;
use App\Models\User;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParentController extends Controller
{
    use ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ParentCollection
     */
    public function index(Request $request)
    {
        $parents = Parents::all();

        return new ParentCollection($parents);
    }

    /**
     * @param \App\Http\Requests\ParentStoreRequest $request
     * @return \App\Http\Resources\ParentResource
     */
    public function store(ParentStoreRequest $request)
    {
        $parent = Parents::create($request->validated());

        return new ParentResource($parent);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Parent $parent
     * @return \App\Http\Resources\ParentResource
     */
    public function show(Request $request, Parent $parent)
    {
        return new ParentResource($parent);
    }

    /**
     * @param \App\Http\Requests\ParentUpdateRequest $request
     * @param \App\Models\Parent $parent
     * @return \App\Http\Resources\ParentResource
     */
    public function update(ParentUpdateRequest $request, Parents $parents)
    {
        $parents->update($request->validated());

        return new ParentResource($parents);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Parent $parent
     * @return JsonResponse
     */
    public function destroy(Request $request, Parents $parents)
    {
        $parents->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }

    public function toggle(Parents $parents): JsonResponse
    {
        try {
            $parents->update(['is_active' => !$parents->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }

    public function findByEmail($email)
    {
        $user = User::where(['userable_type'=>'App\Models\Parents','email'=>$email])->first();
        if (isset($user->id))  return new ParentResource($user->userable);
        else return response()->json(['status'=>'fail','message'=>'Not found'],404);
    }

    public function export(Request $request)
    {
        $cols = ['father_name', 'father_phone_no','father_nid','present_address','parmanent_address'];
        $headers = ['Guardian Name', 'Phone Number','SSN', 'Present Address','Permanent Address'];
        $total=[];
        $where=[];
        $template='exporter.commonTablePdf2';
        return $this->commonDataExporter('Parents', $cols, $headers,$total,$where,$template);

    }
}
