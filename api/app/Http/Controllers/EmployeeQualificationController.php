<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeQualificationStoreRequest;
use App\Http\Requests\EmployeeQualificationUpdateRequest;
use App\Http\Resources\EmployeeQualificationCollection;
use App\Http\Resources\EmployeeQualificationResource;
use App\Models\EmployeeQualification;
use Illuminate\Http\Request;

class EmployeeQualificationController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeQualificationCollection
     */
    public function index(Request $request)
    {
        $employeeQualifications = EmployeeQualification::all();

        return new EmployeeQualificationCollection($employeeQualifications);
    }

    /**
     * @param \App\Http\Requests\EmployeeQualificationStoreRequest $request
     * @return \App\Http\Resources\EmployeeQualificationResource
     */
    public function store(EmployeeQualificationStoreRequest $request)
    {
        $employeeQualification = EmployeeQualification::create($request->validated());

        return new EmployeeQualificationResource($employeeQualification);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeeQualification $employeeQualification
     * @return \App\Http\Resources\EmployeeQualificationResource
     */
    public function show(Request $request, EmployeeQualification $employeeQualification)
    {
        return new EmployeeQualificationResource($employeeQualification);
    }

    /**
     * @param \App\Http\Requests\EmployeeQualificationUpdateRequest $request
     * @param \App\Models\EmployeeQualification $employeeQualification
     * @return \App\Http\Resources\EmployeeQualificationResource
     */
    public function update(EmployeeQualificationUpdateRequest $request, EmployeeQualification $employeeQualification)
    {
        $employeeQualification->update($request->validated());

        return new EmployeeQualificationResource($employeeQualification);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\EmployeeQualification $employeeQualification
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, EmployeeQualification $employeeQualification)
    {
        $employeeQualification->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }
}
