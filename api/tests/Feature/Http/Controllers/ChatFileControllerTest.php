<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\ChatFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ChatFileController
 */
class ChatFileControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $chatFiles = ChatFile::factory()->count(3)->create();

        $response = $this->get(route('chat-file.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ChatFileController::class,
            'store',
            \App\Http\Requests\ChatFileStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $response = $this->post(route('chat-file.store'));

        $response->assertCreated();
        $response->assertJsonStructure([]);

        $this->assertDatabaseHas(chatFiles, [ /* ... */ ]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $chatFile = ChatFile::factory()->create();

        $response = $this->get(route('chat-file.show', $chatFile));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ChatFileController::class,
            'update',
            \App\Http\Requests\ChatFileUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $chatFile = ChatFile::factory()->create();

        $response = $this->put(route('chat-file.update', $chatFile));

        $chatFile->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $chatFile = ChatFile::factory()->create();

        $response = $this->delete(route('chat-file.destroy', $chatFile));

        $response->assertNoContent();

        $this->assertSoftDeleted($chatFile);
    }
}
