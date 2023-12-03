<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Blog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\BlogController
 */
class BlogControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $blogs = Blog::factory()->count(3)->create();

        $response = $this->get(route('blog.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\BlogController::class,
            'store',
            \App\Http\Requests\BlogStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $type = $this->faker->numberBetween(-8, 8);
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->post(route('blog.store'), [
            'type' => $type,
            'position' => $position,
            'status' => $status,
        ]);

        $blogs = Blog::query()
            ->where('type', $type)
            ->where('position', $position)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $blogs);
        $blog = $blogs->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $blog = Blog::factory()->create();

        $response = $this->get(route('blog.show', $blog));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\BlogController::class,
            'update',
            \App\Http\Requests\BlogUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $blog = Blog::factory()->create();
        $type = $this->faker->numberBetween(-8, 8);
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->put(route('blog.update', $blog), [
            'type' => $type,
            'position' => $position,
            'status' => $status,
        ]);

        $blog->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($type, $blog->type);
        $this->assertEquals($position, $blog->position);
        $this->assertEquals($status, $blog->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $blog = Blog::factory()->create();

        $response = $this->delete(route('blog.destroy', $blog));

        $response->assertNoContent();

        $this->assertSoftDeleted($blog);
    }
}
