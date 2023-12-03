<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Parents;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ParentController
 */
class ParentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $parents = Parents::factory()->count(3)->create();

        $response = $this->get(route('parent.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ParentController::class,
            'store',
            \App\Http\Requests\ParentStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $father_phone_no = $this->faker->word;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('parent.store'), [
            'father_phone_no' => $father_phone_no,
            'is_active' => $is_active,
        ]);

        $parents = Parent::query()
            ->where('father_phone_no', $father_phone_no)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $parents);
        $parent = $parents->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $parent = Parent::factory()->create();

        $response = $this->get(route('parent.show', $parent));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ParentController::class,
            'update',
            \App\Http\Requests\ParentUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $parent = Parent::factory()->create();
        $father_phone_no = $this->faker->word;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('parent.update', $parent), [
            'father_phone_no' => $father_phone_no,
            'is_active' => $is_active,
        ]);

        $parent->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($father_phone_no, $parent->father_phone_no);
        $this->assertEquals($is_active, $parent->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $parent = Parent::factory()->create();

        $response = $this->delete(route('parent.destroy', $parent));

        $response->assertNoContent();

        $this->assertSoftDeleted($parent);
    }
}
