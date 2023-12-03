<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentAnswerStoreRequest;
use App\Http\Resources\ExamQuestionCollection;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\StudentAnswer;
use App\Traits\CommonTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


class StudentExamController extends Controller
{
    use CommonTrait;

    public function studentExamQuestions(Request $request, Exam $exam)
    {
        if (auth()->user()->role_id != 3) return response()->json(['status'=>'error','message'=>'You are not a student for submit answer must be login as a student'],404);

        $questions = $exam->examQuestions()->orderBy('id','ASC')->get(['id','exam_id', 'question_type', 'question_part', 'question', 'options','mark']);
        return new ExamQuestionCollection($questions);
    }
    public function studentExamQuestionWithAnswer(Request $request, Exam $exam)
    {
        $questions = $exam->examQuestions()->orderBy('id','ASC')->get(['id','exam_id', 'question_type', 'question_part', 'question','answer', 'options','mark']);
        return new ExamQuestionCollection($questions);
    }

    public function studentExam(Request $request, Exam $exam)
    {
        if (auth()->user()->role_id != 3) return response()->json(['status'=>'error','message'=>'You are not a student for submit answer must be login as a student'],404);

        $std = auth()->user()->userable;

        $pdf =  Cache::remember('exam_'.$exam->id,300,function () use ($std, $exam) {
            return $this->bas64EncodePdf($exam->question);
        });
        $exam = $exam->with([
            'course',
            'satSection.satScores',
            'studentAnswers'=>function($q) use ($std) {$q->where('student_id',$std->id)->orderBy('exam_question_id','ASC');},
        ])->where('id',$exam->id)->first();
        $exam->question = $pdf;
        return new ExamResource($exam);

    }

    /*
     *
     * method for regular answer store
     * */
    public function studentAnswerSubmit(Request $request)
    {
        if (auth()->user()->role_id != 3) return response()->json(['status'=>'error','message'=>'You are not a student for submit answer must be login as a student'],404);

        $request = new Request(json_decode($request->answer,false));
        $data = [];
        $ip =$request->ip();
        $id = auth()->id();
        $dd = $request->all();
        $std = auth()->user()->userable;
        if (!isset($dd[0])) return response()->json(['status'=>'error','message'=>'No question selected/added'],404);

        $exam_questions = ExamQuestion::where('exam_id',$dd[0]->exam_id)->get();
        foreach ($request->all() as $key=>$req){
            $question = $exam_questions->where('id',$req->question_id)->first();
            $mark = isset($question->id) ? $req->student_answer==$question->answer ? $question->mark : 0 : 0;
            $data[$key]['student_id']=$std->id;
            $data[$key]['exam_id']=$req->exam_id;
            $data[$key]['exam_question_id']=$req->question_id;
            $data[$key]['student_answer']=$req->student_answer;
            $data[$key]['correct_answer']=isset($question->answer)?$question->answer:'';
            $data[$key]['total_mark']=isset($question->mark)?$question->mark:0;
            $data[$key]['mark']=$mark;
            $data[$key]['created_by']= $id;
            $data[$key]['ip']= $ip;
        }

        StudentAnswer::insert($data);
        return response()->json(['status'=>'success','message'=>'Successfully submitted your answer'],200);
    }

    /*
     * method for sat one by one answer store or update
     * */
    public function storeUpdateAnswer(StudentAnswerStoreRequest $request, Exam $exam)
    {
        if (auth()->user()->role_id != 3) return response()->json(['status'=>'error','message'=>'You are not a student for submit answer must be login as a student'],404);

        $data = $request->validated();
        $std = auth()->user()->userable;
        $question = ExamQuestion::find($data['exam_question_id']);
        $mark = isset($question->id) ? $data['student_answer'] == $question->answer ? $question->mark : 0 : 0;
        $data2 = [
            'student_id'=>$std->id,
            'exam_id'=>$exam->id,
            'exam_question_id'=>$question->id,
            'student_answer'=>$data['student_answer'],
            'correct_answer'=>isset($question->answer)?$question->answer:'',
            'total_mark'=>isset($question->mark)?$question->mark:0,
            'mark'=>$mark,
        ];
        $data2 += $this->storeMetadata($request);
        $answer = StudentAnswer::where(['exam_id'=>$exam->id,'student_id'=>$std->id,'exam_question_id'=>$question->id])->first();
        if (isset($answer->id)) {
            try {
                $answer->update($data2);
                return response()->json(['status'=>'success','message'=>'Successfully stored'],200);
            }catch (\Exception $e){
                return response()->json(['status'=>'error','message'=>'invalid request'],404);
            }
        }
        else {
            $ans = StudentAnswer::create($data2);
            if (isset($ans->id)) return response()->json(['status'=>'success','message'=>'Successfully stored'],200);
            else return response()->json(['status'=>'error','message'=>'invalid request'],404);
        }

    }

}
