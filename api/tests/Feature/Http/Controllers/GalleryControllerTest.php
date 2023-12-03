<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\GalleryController
 */
class GalleryControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $galleries = Gallery::factory()->count(3)->create();

        $response = $this->get(route('gallery.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\GalleryController::class,
            'store',
            \App\Http\Requests\GalleryStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->post(route('gallery.store'), [
            'name' => $name,
            'position' => $position,
            'status' => $status,
        ]);

        $galleries = Gallery::query()
            ->where('name', $name)
            ->where('position', $position)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $galleries);
        $gallery = $galleries->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $gallery = Gallery::factory()->create();

        $response = $this->get(route('gallery.show', $gallery));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\GalleryController::class,
            'update',
            \App\Http\Requests\GalleryUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $gallery = Gallery::factory()->create();
        $name = $this->faker->name;
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->put(route('gallery.update', $gallery), [
            'name' => $name,
            'position' => $position,
            'status' => $status,
        ]);

        $gallery->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $gallery->name);
        $this->assertEquals($position, $gallery->position);
        $this->assertEquals($status, $gallery->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $gallery = Gallery::factory()->create();

        $response = $this->delete(route('gallery.destroy', $gallery));

        $response->assertNoContent();

        $this->assertSoftDeleted($gallery);
    }
}
