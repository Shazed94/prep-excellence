<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\BlogComment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\BlogCommentController
 */
class BlogCommentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $blogComments = BlogComment::factory()->count(3)->create();

        $response = $this->get(route('blog-comment.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\BlogCommentController::class,
            'store',
            \App\Http\Requests\BlogCommentStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $response = $this->post(route('blog-comment.store'));

        $response->assertCreated();
        $response->assertJsonStructure([]);

        $this->assertDatabaseHas(blogComments, [ /* ... */ ]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $blogComment = BlogComment::factory()->create();

        $response = $this->get(route('blog-comment.show', $blogComment));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\BlogCommentController::class,
            'update',
            \App\Http\Requests\BlogCommentUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $blogComment = BlogComment::factory()->create();

        $response = $this->put(route('blog-comment.update', $blogComment));

        $blogComment->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $blogComment = BlogComment::factory()->create();

        $response = $this->delete(route('blog-comment.destroy', $blogComment));

        $response->assertNoContent();

        $this->assertSoftDeleted($blogComment);
    }
}
