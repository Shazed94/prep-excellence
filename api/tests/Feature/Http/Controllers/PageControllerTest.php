<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\PageController
 */
class PageControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $pages = Page::factory()->count(3)->create();

        $response = $this->get(route('page.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PageController::class,
            'store',
            \App\Http\Requests\PageStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $title = $this->faker->sentence(4);
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->post(route('page.store'), [
            'title' => $title,
            'position' => $position,
            'status' => $status,
        ]);

        $pages = Page::query()
            ->where('title', $title)
            ->where('position', $position)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $pages);
        $page = $pages->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $page = Page::factory()->create();

        $response = $this->get(route('page.show', $page));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PageController::class,
            'update',
            \App\Http\Requests\PageUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $page = Page::factory()->create();
        $title = $this->faker->sentence(4);
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->put(route('page.update', $page), [
            'title' => $title,
            'position' => $position,
            'status' => $status,
        ]);

        $page->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($title, $page->title);
        $this->assertEquals($position, $page->position);
        $this->assertEquals($status, $page->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $page = Page::factory()->create();

        $response = $this->delete(route('page.destroy', $page));

        $response->assertNoContent();

        $this->assertSoftDeleted($page);
    }
}
