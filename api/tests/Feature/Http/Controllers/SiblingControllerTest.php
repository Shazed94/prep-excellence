<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Sibling;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\SiblingController
 */
class SiblingControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $siblings = Sibling::factory()->count(3)->create();

        $response = $this->get(route('sibling.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SiblingController::class,
            'store',
            \App\Http\Requests\SiblingStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $is_active = $this->faker->boolean;

        $response = $this->post(route('sibling.store'), [
            'is_active' => $is_active,
        ]);

        $siblings = Sibling::query()
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $siblings);
        $sibling = $siblings->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $sibling = Sibling::factory()->create();

        $response = $this->get(route('sibling.show', $sibling));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SiblingController::class,
            'update',
            \App\Http\Requests\SiblingUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $sibling = Sibling::factory()->create();
        $is_active = $this->faker->boolean;

        $response = $this->put(route('sibling.update', $sibling), [
            'is_active' => $is_active,
        ]);

        $sibling->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($is_active, $sibling->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $sibling = Sibling::factory()->create();

        $response = $this->delete(route('sibling.destroy', $sibling));

        $response->assertNoContent();

        $this->assertSoftDeleted($sibling);
    }
}
