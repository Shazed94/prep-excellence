<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Complain;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ComplainController
 */
class ComplainControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $complains = Complain::factory()->count(3)->create();

        $response = $this->get(route('complain.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ComplainController::class,
            'store',
            \App\Http\Requests\ComplainStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $status = $this->faker->numberBetween(-8, 8);

        $response = $this->post(route('complain.store'), [
            'status' => $status,
        ]);

        $complains = Complain::query()
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $complains);
        $complain = $complains->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $complain = Complain::factory()->create();

        $response = $this->get(route('complain.show', $complain));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ComplainController::class,
            'update',
            \App\Http\Requests\ComplainUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $complain = Complain::factory()->create();
        $status = $this->faker->numberBetween(-8, 8);

        $response = $this->put(route('complain.update', $complain), [
            'status' => $status,
        ]);

        $complain->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($status, $complain->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $complain = Complain::factory()->create();

        $response = $this->delete(route('complain.destroy', $complain));

        $response->assertNoContent();

        $this->assertSoftDeleted($complain);
    }
}
