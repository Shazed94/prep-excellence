<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamQuestionStoreRequest;
use App\Http\Requests\ExamQuestionUpdateRequest;
use App\Http\Resources\ExamQuestionCollection;
use App\Http\Resources\ExamQuestionResource;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExamQuestionController extends Controller
{
    use FileUploadTrait;
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ExamQuestionCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $examQuestions = ExamQuestion::query();
        /*if ($search) {
            $exams->whereLike(['title','description'], $search);
        }*/

        return new ExamQuestionCollection($examQuestions->paginate($itemsPerPage));
    }

    public function questionByExamId(Exam $exam)
    {
        $questions = $exam->examQuestions;
        return new ExamQuestionCollection($questions);
    }

    public function store(Request $request)
    {
        $data1 = $request->all();
        $exam = Exam::find($request->exam_id);
        $question = null;
        if ($request->file('question_file')){
            $question = $this->uploadFile($request->file('question_file'),'question');
        }
        if ($question) $exam->update(['question_type'=>$request->question_type,'question'=>$question]);
        else $exam->update(['question_type'=>$request->question_type]);

        $data = json_decode($request->questions,true);
        $request = new Request($data);
        Validator::make($request->all(),[
            '*.exam_id'=>'required|not_in:0|exists:exams,id',
            '*.question'=>'',
            '*.answer'=>'',
            '*.mark'=>'required|numeric',
            '*.options'=>'',
            '*.question_type'=>'required|integer',
        ])->validate();
        $data = [];
        foreach ($request->all() as $dt){
            $dt['options']= json_encode($dt['options']);
            $dt['question_part']= isset($data1['question_part']) ? $data1['question_part'] : null;
            $dt['created_at']= now();
            $dt['updated_at']= now();
            $dt['created_by']= auth()->id();
            $data[]=$dt;
        }
        //return $data;
        ExamQuestion::insert($data);

        return response()->json(['status'=>'success','message'=>'Added successfully'],200);
    }

    public function singleStore(ExamQuestionStoreRequest $request)
    {
        $exam_question = ExamQuestion::create($request->validated());
        return new ExamQuestionResource($exam_question);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ExamQuestion $examQuestion
     * @return \App\Http\Resources\ExamQuestionResource
     */
    public function show(Request $request, ExamQuestion $examQuestion)
    {
        return new ExamQuestionResource($examQuestion);
    }

    /**
     * @param \App\Http\Requests\ExamQuestionUpdateRequest $request
     * @param \App\Models\ExamQuestion $examQuestion
     * @return \App\Http\Resources\ExamQuestionResource
     */
    public function update(ExamQuestionUpdateRequest $request, ExamQuestion $examQuestion)
    {
        $data = $request->except(['options']);
        $data +=['options'=>json_decode($request->options,true)];
        $examQuestion->update($data);

        return new ExamQuestionResource($examQuestion);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ExamQuestion $examQuestion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, ExamQuestion $examQuestion)
    {
        $examQuestion->delete();

        return response()->noContent();
    }
}
