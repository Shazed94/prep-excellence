<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Exam;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ExamController
 */
class ExamControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $exams = Exam::factory()->count(3)->create();

        $response = $this->get(route('exam.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ExamController::class,
            'store',
            \App\Http\Requests\ExamStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $duration = $this->faker->randomFloat(/** double_attributes **/);
        $status = $this->faker->numberBetween(-10000, 10000);

        $response = $this->post(route('exam.store'), [
            'duration' => $duration,
            'status' => $status,
        ]);

        $exams = Exam::query()
            ->where('duration', $duration)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $exams);
        $exam = $exams->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $exam = Exam::factory()->create();

        $response = $this->get(route('exam.show', $exam));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ExamController::class,
            'update',
            \App\Http\Requests\ExamUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $exam = Exam::factory()->create();
        $duration = $this->faker->randomFloat(/** double_attributes **/);
        $status = $this->faker->numberBetween(-10000, 10000);

        $response = $this->put(route('exam.update', $exam), [
            'duration' => $duration,
            'status' => $status,
        ]);

        $exam->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($duration, $exam->duration);
        $this->assertEquals($status, $exam->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $exam = Exam::factory()->create();

        $response = $this->delete(route('exam.destroy', $exam));

        $response->assertNoContent();

        $this->assertSoftDeleted($exam);
    }
}
