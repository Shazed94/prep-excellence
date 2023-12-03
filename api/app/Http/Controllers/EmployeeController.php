<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;
use App\Http\Resources\EmployeeCollection;
use App\Http\Resources\EmployeeResource;
use App\Models\ChatUser;
use App\Models\Employee;
use App\Traits\FileUploadTrait;
use App\Traits\ReportTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    use FileUploadTrait, ReportTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\EmployeeCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $employees = Employee::query();
        if ($search) {
            $employees->whereLike(['employee_id','userable.first_name','userable.last_name','userable.email','userable.phone_number'], $search);
        }
        $employees = $employees->where('id','!=',1)->with(['userable','userable.gender','userable.bloodGroup',
            'userable.religion','userable.role',
            'designation','maritalStatus',
            'employeeQualifications','workExperiences','employeeSubjectSalaries'])->orderBy('id','DESC')->paginate($itemsPerPage);
        return new EmployeeCollection($employees);
    }

    public function allEmployeeActive(Request $request)
    {
        $employees = Employee::query();
        $employees = $employees->where('id','!=',1)
            ->where(['is_active'=>1])->with(['userable','employeeSubjectSalaries'])
            ->orderBy('id','DESC')->get();
        return new EmployeeCollection($employees);
    }

    /**
     * @param \App\Http\Requests\EmployeeStoreRequest $request
     *
     */
    public function store(EmployeeStoreRequest $request)
    {
        $user_data= $request->only(['first_name', 'last_name', 'email','phone_number','role_id','gender_id','blood_group_id','religion_id']);
        $employee_data = $request->only(['employee_id', 'designation_id', 'father_name', 'mother_name', 'nid', 'marital_status_id', 'emergency_contact', 'present_address', 'permanent_address', 'join_date','hour_rate','biography','short_biography']);

        /*
         *existing employee id find
         * */
        $check = Employee::where('employee_id', '!=', null)->latest('id')->first(['id','employee_id']);

        if (isset($check->id)){
            $employee_id = $check->employee_id + 1;
        }else{
            $employee_id = date('Y') . '0001';//generate employee id
        }
        while (1){
            $emp = DB::table('employees')->where(['employee_id'=>$employee_id])->where('employee_id', '!=', null)->latest('id')->first();
            if(!isset($emp->id)) break;
            else{
                $employee_id = $emp->employee_id + 1;
            }
        }
        $employee_data +=['employee_id'=>$employee_id];
        //$employee = Employee::create($employee_data);
        DB::beginTransaction();
        try {
            if ($request->file('image')){
                $img = $this->imageUpload($request->file('image'),'employee',600, 600);
                $user_data +=[
                    'image'=>$img,
                ];
            }
            $employee = Employee::create($employee_data);
            $user_data +=[
                'password'=>Hash::make($employee_id),
            ];
            $employee->userable()->create($user_data);
            if ($request->employee_qualifications){
                $eqs = json_decode($request->employee_qualifications,true);
                $eq2=[];
                foreach ($eqs as $eq){
                    $eq['employee_id']=$employee->id;
                    $eq['created_at']=now();
                    $eq['updated_at']=now();
                    $eq2[]=$eq;
                }
                $employee->employeeQualifications()->insert($eq2);
            }
            if ($request->work_experiences){
                $wes = json_decode($request->work_experiences,true);
                $wes2=[];
                foreach ($wes as $eq){
                    $eq['employee_id']=$employee->id;
                    $eq['created_at']=now();
                    $eq['updated_at']=now();
                    $wes2[]=$eq;
                }
                $employee->workExperiences()->insert($wes2);
            }
            if ($request->employee_subject_salaries){
                $ess = json_decode($request->employee_subject_salaries,true);
                $ess2=[];
                foreach ($ess as $eq){
                    $eq['employee_id'] = $employee->id;
                    $eq['created_at'] = now();
                    $eq['updated_at'] = now();
                    $eq['created_by'] = auth()->id();
                    $eq['updated_by'] = auth()->id();
                    $ess2[] = $eq;
                }
                $employee->employeeSubjectSalaries()->insert($ess2);
            }
            DB::commit();
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status'=>'error','message'=>'Employee create fail'],404);
        }

        return new EmployeeResource($employee->load(['userable','userable.gender','userable.bloodGroup',
            'userable.religion','userable.role',
            'designation','maritalStatus',
            'employeeQualifications','workExperiences','employeeSubjectSalaries']));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Employee $employee
     * @return \App\Http\Resources\EmployeeResource
     */
    public function show(Request $request, Employee $employee)
    {
        return new EmployeeResource($employee->load(['userable','userable.gender','userable.bloodGroup',
            'userable.religion','userable.role',
            'designation','maritalStatus',
            'employeeQualifications','workExperiences','employeeSubjectSalaries']));
    }

    /**
     * @param \App\Http\Requests\EmployeeUpdateRequest $request
     * @param \App\Models\Employee $employee
     *
     */
    public function update(EmployeeUpdateRequest $request, Employee $employee)
    {
        $user = $employee->userable;
        //return $user->id;
        Validator::make($request->all(),[
            'email' => ['required','email','max:191','unique:users,email,'.$user->id],
         ])->validate();
        $user_data= $request->only(['first_name', 'last_name','email','phone_number','role_id','gender_id','blood_group_id','religion_id']);
        $employee_data = $request->only(['designation_id', 'father_name', 'mother_name', 'nid', 'marital_status_id', 'emergency_contact', 'present_address', 'permanent_address', 'join_date','hour_rate','biography','short_biography']);
        DB::beginTransaction();
        try {
            $employee->update($employee_data);
            if ($request->file('image')){
                $img = $this->imageUpload($request->file('image'),'employee',600, 600);
                $user_data +=[
                    'image'=>$img,
                ];
            }
            $employee->userable->update($user_data);
            if ($request->employee_qualifications){
                $eqs = json_decode($request->employee_qualifications,false);
                $eq2=[];
                foreach ($eqs as $eq){
                    $eq2[]=[
                        'employee_id'=>$employee->id,
                        'exam_name'=>$eq->exam_name,
                        'institute'=>$eq->institute,
                        'state'=>$eq->state,
                        'country'=>$eq->country,
                        'result'=>$eq->result,
                        'out_of_result'=>isset($eq->out_of_result) ? $eq->out_of_result:'',
                        'created_at'=> now(),
                        'updated_at'=>now(),
                    ];
                }
                try {
                    $employee->employeeQualifications()->delete();
                    $employee->employeeQualifications()->insert($eq2);
                }catch (\Exception $e){
                    //
                }

            }
            if ($request->work_experiences){
                $wes = json_decode($request->work_experiences,false);
                $wes2=[];
                foreach ($wes as $eq){
                    $wes2[]=[
                        'employee_id'=>$employee->id,
                        'institute'=>$eq->institute,
                        'designation'=>$eq->designation,
                        'start_date'=>$eq->start_date,
                        'end_date'=>isset($eq->end_date) ? $eq->end_date:null,
                        //'number_of_year'=>$eq->number_of_year,
                        'is_working'=>$eq->is_working,
                        'created_at'=> now(),
                        'updated_at'=>now(),
                    ];
                }
                try {
                    $employee->workExperiences()->delete();
                    $employee->workExperiences()->insert($wes2);
                }catch (\Exception $e){
                    //
                }
            }
            if ($request->employee_subject_salaries){
                $ess = json_decode($request->employee_subject_salaries,true);
                $ess2=[];
                foreach ($ess as $eq){
                    $eq['employee_id'] = $employee->id;
                    $eq['created_at'] = now();
                    $eq['updated_at'] = now();
                    $eq['created_by'] = auth()->id();
                    $eq['updated_by'] = auth()->id();
                    $ess2[] = $eq;
                }
                try {
                    $employee->employeeSubjectSalaries()->delete();
                    $employee->employeeSubjectSalaries()->insert($ess2);
                }catch (\Exception $e){
                    //
                }
            }
            DB::commit();
        }catch (\Exception $e){
            DB::rollback();
            return response()->json(['status'=>'error','message'=>'Invalid request'],404);
        }
        return new EmployeeResource($employee->load(['userable','userable.gender','userable.bloodGroup',
            'userable.religion','userable.role',
            'designation','maritalStatus',
            'employeeQualifications','workExperiences','employeeSubjectSalaries']));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Employee $employee
     * @return JsonResponse
     */
    public function destroy(Request $request, Employee $employee)
    {
        if ($employee->courseEmployees()->count()) return response()->json(['status' => 'error', 'message'=>'This teacher can\'t not be deleted since he/she was assigned to one or more courses.'], 404);
        $user = $employee->userable;
        ChatUser::where('sender_id',$user->id)->orWhere('receiver_id',$user->id)->delete();
        $employee->delete();
        $user->delete();
        return response()->json(['status'=>'success','message'=>'Employee has been removed successfully'],200);
    }

    public function toggle(Employee $employee): JsonResponse
    {
        try {
            $employee->userable()->update(['is_active' => !$employee->is_active]);
            $employee->update(['is_active' => !$employee->is_active]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
    public function export(Request $request)
    {
        $cols = ['userable.name','userable.phone_number','userable.email', 'employee_id','designation.name','join_date','hour_rate','salary_monthly'];
        $headers = ['Name','Phone Number','Email', 'Employee ID','Designation', 'Join Date','Hour rate','Salary Monthly',];
        return $this->commonDataExporter('Employee', $cols, $headers);
    }
}
