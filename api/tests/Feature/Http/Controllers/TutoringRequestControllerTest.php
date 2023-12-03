<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\TutoringRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\TutoringRequestController
 */
class TutoringRequestControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $tutoringRequests = TutoringRequest::factory()->count(3)->create();

        $response = $this->get(route('tutoring-request.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\TutoringRequestController::class,
            'store',
            \App\Http\Requests\TutoringRequestStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $status = $this->faker->numberBetween(-8, 8);

        $response = $this->post(route('tutoring-request.store'), [
            'status' => $status,
        ]);

        $tutoringRequests = TutoringRequest::query()
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $tutoringRequests);
        $tutoringRequest = $tutoringRequests->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $tutoringRequest = TutoringRequest::factory()->create();

        $response = $this->get(route('tutoring-request.show', $tutoringRequest));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\TutoringRequestController::class,
            'update',
            \App\Http\Requests\TutoringRequestUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $tutoringRequest = TutoringRequest::factory()->create();
        $status = $this->faker->numberBetween(-8, 8);

        $response = $this->put(route('tutoring-request.update', $tutoringRequest), [
            'status' => $status,
        ]);

        $tutoringRequest->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($status, $tutoringRequest->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $tutoringRequest = TutoringRequest::factory()->create();

        $response = $this->delete(route('tutoring-request.destroy', $tutoringRequest));

        $response->assertNoContent();

        $this->assertSoftDeleted($tutoringRequest);
    }
}
