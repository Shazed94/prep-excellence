<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\QuestionBank;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\QuestionBankController
 */
class QuestionBankControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $questionBanks = QuestionBank::factory()->count(3)->create();

        $response = $this->get(route('question-bank.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\QuestionBankController::class,
            'store',
            \App\Http\Requests\QuestionBankStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $question_type = $this->faker->numberBetween(-8, 8);
        $mark = $this->faker->randomFloat(/** double_attributes **/);

        $response = $this->post(route('question-bank.store'), [
            'question_type' => $question_type,
            'mark' => $mark,
        ]);

        $questionBanks = QuestionBank::query()
            ->where('question_type', $question_type)
            ->where('mark', $mark)
            ->get();
        $this->assertCount(1, $questionBanks);
        $questionBank = $questionBanks->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $questionBank = QuestionBank::factory()->create();

        $response = $this->get(route('question-bank.show', $questionBank));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\QuestionBankController::class,
            'update',
            \App\Http\Requests\QuestionBankUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $questionBank = QuestionBank::factory()->create();
        $question_type = $this->faker->numberBetween(-8, 8);
        $mark = $this->faker->randomFloat(/** double_attributes **/);

        $response = $this->put(route('question-bank.update', $questionBank), [
            'question_type' => $question_type,
            'mark' => $mark,
        ]);

        $questionBank->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($question_type, $questionBank->question_type);
        $this->assertEquals($mark, $questionBank->mark);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $questionBank = QuestionBank::factory()->create();

        $response = $this->delete(route('question-bank.destroy', $questionBank));

        $response->assertNoContent();

        $this->assertSoftDeleted($questionBank);
    }
}
