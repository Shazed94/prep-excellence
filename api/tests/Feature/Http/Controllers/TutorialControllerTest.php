<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Tutorial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\TutorialController
 */
class TutorialControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $tutorials = Tutorial::factory()->count(3)->create();

        $response = $this->get(route('tutorial.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\TutorialController::class,
            'store',
            \App\Http\Requests\TutorialStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $response = $this->post(route('tutorial.store'));

        $response->assertCreated();
        $response->assertJsonStructure([]);

        $this->assertDatabaseHas(tutorials, [ /* ... */ ]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $tutorial = Tutorial::factory()->create();

        $response = $this->get(route('tutorial.show', $tutorial));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\TutorialController::class,
            'update',
            \App\Http\Requests\TutorialUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $tutorial = Tutorial::factory()->create();

        $response = $this->put(route('tutorial.update', $tutorial));

        $tutorial->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $tutorial = Tutorial::factory()->create();

        $response = $this->delete(route('tutorial.destroy', $tutorial));

        $response->assertNoContent();

        $this->assertSoftDeleted($tutorial);
    }
}
