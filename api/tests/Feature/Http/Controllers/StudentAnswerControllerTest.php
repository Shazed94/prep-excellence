<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\StudentAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\StudentAnswerController
 */
class StudentAnswerControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $studentAnswers = StudentAnswer::factory()->count(3)->create();

        $response = $this->get(route('student-answer.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\StudentAnswerController::class,
            'store',
            \App\Http\Requests\StudentAnswerStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $total_mark = $this->faker->randomFloat(/** double_attributes **/);
        $mark = $this->faker->randomFloat(/** double_attributes **/);

        $response = $this->post(route('student-answer.store'), [
            'total_mark' => $total_mark,
            'mark' => $mark,
        ]);

        $studentAnswers = StudentAnswer::query()
            ->where('total_mark', $total_mark)
            ->where('mark', $mark)
            ->get();
        $this->assertCount(1, $studentAnswers);
        $studentAnswer = $studentAnswers->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $studentAnswer = StudentAnswer::factory()->create();

        $response = $this->get(route('student-answer.show', $studentAnswer));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\StudentAnswerController::class,
            'update',
            \App\Http\Requests\StudentAnswerUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $studentAnswer = StudentAnswer::factory()->create();
        $total_mark = $this->faker->randomFloat(/** double_attributes **/);
        $mark = $this->faker->randomFloat(/** double_attributes **/);

        $response = $this->put(route('student-answer.update', $studentAnswer), [
            'total_mark' => $total_mark,
            'mark' => $mark,
        ]);

        $studentAnswer->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($total_mark, $studentAnswer->total_mark);
        $this->assertEquals($mark, $studentAnswer->mark);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $studentAnswer = StudentAnswer::factory()->create();

        $response = $this->delete(route('student-answer.destroy', $studentAnswer));

        $response->assertNoContent();

        $this->assertSoftDeleted($studentAnswer);
    }
}
