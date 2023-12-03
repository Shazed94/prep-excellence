<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Advisor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\AdvisorController
 */
class AdvisorControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $advisors = Advisor::factory()->count(3)->create();

        $response = $this->get(route('advisor.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\AdvisorController::class,
            'store',
            \App\Http\Requests\AdvisorStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $response = $this->post(route('advisor.store'));

        $response->assertCreated();
        $response->assertJsonStructure([]);

        $this->assertDatabaseHas(advisors, [ /* ... */ ]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $advisor = Advisor::factory()->create();

        $response = $this->get(route('advisor.show', $advisor));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\AdvisorController::class,
            'update',
            \App\Http\Requests\AdvisorUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $advisor = Advisor::factory()->create();

        $response = $this->put(route('advisor.update', $advisor));

        $advisor->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $advisor = Advisor::factory()->create();

        $response = $this->delete(route('advisor.destroy', $advisor));

        $response->assertNoContent();

        $this->assertSoftDeleted($advisor);
    }
}
