<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExamStoreRequest;
use App\Http\Requests\ExamUpdateRequest;
use App\Http\Resources\ExamCollection;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use App\Traits\CommonTrait;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    use CommonTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ExamCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $exams = Exam::query();
        if ($search) {
            $exams->whereLike(['title','duration','course.name','course.batch'], $search);
        }

        return new ExamCollection($exams->with(['course'])->orderBy('id','DESC')->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\ExamStoreRequest $request
     * @return \App\Http\Resources\ExamResource
     */
    public function store(ExamStoreRequest $request)
    {
        $data = $request->validated();
        //$data +=['employee_id'=>auth()->id];
        $data += $this->storeMetadata($request);
        $exam = Exam::create($data);

        return new ExamResource($exam->load('course'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Exam $exam
     * @return \App\Http\Resources\ExamResource
     */
    public function show(Request $request, Exam $exam)
    {
        return new ExamResource($exam->load('course'));
    }

    /**
     * @param \App\Http\Requests\ExamUpdateRequest $request
     * @param \App\Models\Exam $exam
     * @return \App\Http\Resources\ExamResource
     */
    public function update(ExamUpdateRequest $request, Exam $exam)
    {
        $exam->update($request->validated());
        return new ExamResource($exam->load('course'));
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Exam $exam
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Exam $exam)
    {
        $exam->delete();

        return response()->noContent();
    }

    /*
     * method for status change
     * */
    public function toggle(Exam $exam)
    {
        try {
            $exam->update(['status' => !$exam->status]);
            return response()->json(['status'=>'success','message'=>'Successfully status change'],200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid request'], 200);
        }
    }
    /*
     * method for exam clone
     * */
    public function examClone(ExamStoreRequest $request, Exam $exam)
    {
        $data = $request->validated();
        //$data +=['employee_id'=>auth()->id];
        $data += $this->storeMetadata($request);
        $new_exam = Exam::create($data);
        $questions = $exam->examQuestions()->get(['question_bank_id','question_type','question_part','options', 'question', 'answer', 'mark'])->toArray();
        $data2=[];
        foreach ($questions as $qn){
            $qn['options']=json_encode($qn['options']);
            $qn['exam_id']=$new_exam->id;
            $qn['created_by']=auth()->id();
            $qn['created_at']=now();
            $qn['updated_at']=now();
            $data2[]=$qn;
        }
        //return response()->json($questions,200);
        $new_exam->examQuestions()->insert($data2);
        return new ExamResource($new_exam->load('course'));
    }

    public function uploadFileCkeditor(Request $request)
    {
        $img = null;
        if ($request->file('upload')) $img = $this->imageUpload($request->file('upload'),'question');
        return response()->json(['url'=>$img],200);
    }

    public function results(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $exams = Exam::query();
        if ($search) {
            $exams->whereLike(['title','duration','course.name','course.batch'], $search);
        }
        $exams = $exams->with([
            'course.students',
            'satSection.satScores',
            'examQuestions',
            'studentAnswers',
        ])
            ->withCount('examQuestions')
            ->orderBy('id','DESC')
            ->paginate($itemsPerPage);
        //return response()->json($exams,200);
        return new ExamCollection($exams);
       // return new ExamCollection($exams->with(['course'])->orderBy('id','DESC')->paginate($itemsPerPage));

    }
}
