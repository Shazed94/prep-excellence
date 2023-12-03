<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\ExamQuestion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ExamQuestionController
 */
class ExamQuestionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $examQuestions = ExamQuestion::factory()->count(3)->create();

        $response = $this->get(route('exam-question.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ExamQuestionController::class,
            'store',
            \App\Http\Requests\ExamQuestionStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $question_type = $this->faker->numberBetween(-8, 8);
        $mark = $this->faker->randomFloat(/** double_attributes **/);

        $response = $this->post(route('exam-question.store'), [
            'question_type' => $question_type,
            'mark' => $mark,
        ]);

        $examQuestions = ExamQuestion::query()
            ->where('question_type', $question_type)
            ->where('mark', $mark)
            ->get();
        $this->assertCount(1, $examQuestions);
        $examQuestion = $examQuestions->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $examQuestion = ExamQuestion::factory()->create();

        $response = $this->get(route('exam-question.show', $examQuestion));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ExamQuestionController::class,
            'update',
            \App\Http\Requests\ExamQuestionUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $examQuestion = ExamQuestion::factory()->create();
        $question_type = $this->faker->numberBetween(-8, 8);
        $mark = $this->faker->randomFloat(/** double_attributes **/);

        $response = $this->put(route('exam-question.update', $examQuestion), [
            'question_type' => $question_type,
            'mark' => $mark,
        ]);

        $examQuestion->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($question_type, $examQuestion->question_type);
        $this->assertEquals($mark, $examQuestion->mark);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $examQuestion = ExamQuestion::factory()->create();

        $response = $this->delete(route('exam-question.destroy', $examQuestion));

        $response->assertNoContent();

        $this->assertSoftDeleted($examQuestion);
    }
}
