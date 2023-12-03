<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\ChatGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ChatGroupController
 */
class ChatGroupControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $chatGroups = ChatGroup::factory()->count(3)->create();

        $response = $this->get(route('chat-group.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ChatGroupController::class,
            'store',
            \App\Http\Requests\ChatGroupStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $is_active = $this->faker->boolean;

        $response = $this->post(route('chat-group.store'), [
            'is_active' => $is_active,
        ]);

        $chatGroups = ChatGroup::query()
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $chatGroups);
        $chatGroup = $chatGroups->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $chatGroup = ChatGroup::factory()->create();

        $response = $this->get(route('chat-group.show', $chatGroup));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ChatGroupController::class,
            'update',
            \App\Http\Requests\ChatGroupUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $chatGroup = ChatGroup::factory()->create();
        $is_active = $this->faker->boolean;

        $response = $this->put(route('chat-group.update', $chatGroup), [
            'is_active' => $is_active,
        ]);

        $chatGroup->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($is_active, $chatGroup->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $chatGroup = ChatGroup::factory()->create();

        $response = $this->delete(route('chat-group.destroy', $chatGroup));

        $response->assertNoContent();

        $this->assertSoftDeleted($chatGroup);
    }
}
