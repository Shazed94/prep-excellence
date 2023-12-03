<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Faq;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\FaqController
 */
class FaqControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $faqs = Faq::factory()->count(3)->create();

        $response = $this->get(route('faq.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\FaqController::class,
            'store',
            \App\Http\Requests\FaqStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $question = $this->faker->word;
        $status = $this->faker->boolean;

        $response = $this->post(route('faq.store'), [
            'question' => $question,
            'status' => $status,
        ]);

        $faqs = Faq::query()
            ->where('question', $question)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $faqs);
        $faq = $faqs->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $faq = Faq::factory()->create();

        $response = $this->get(route('faq.show', $faq));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\FaqController::class,
            'update',
            \App\Http\Requests\FaqUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $faq = Faq::factory()->create();
        $question = $this->faker->word;
        $status = $this->faker->boolean;

        $response = $this->put(route('faq.update', $faq), [
            'question' => $question,
            'status' => $status,
        ]);

        $faq->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($question, $faq->question);
        $this->assertEquals($status, $faq->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $faq = Faq::factory()->create();

        $response = $this->delete(route('faq.destroy', $faq));

        $response->assertNoContent();

        $this->assertSoftDeleted($faq);
    }
}
