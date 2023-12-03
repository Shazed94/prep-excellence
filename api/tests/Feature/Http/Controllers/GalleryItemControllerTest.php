<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\GalleryItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\GalleryItemController
 */
class GalleryItemControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $galleryItems = GalleryItem::factory()->count(3)->create();

        $response = $this->get(route('gallery-item.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\GalleryItemController::class,
            'store',
            \App\Http\Requests\GalleryItemStoreRequest::class
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

        $response = $this->post(route('gallery-item.store'), [
            'type' => $type,
            'position' => $position,
            'status' => $status,
        ]);

        $galleryItems = GalleryItem::query()
            ->where('type', $type)
            ->where('position', $position)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $galleryItems);
        $galleryItem = $galleryItems->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $galleryItem = GalleryItem::factory()->create();

        $response = $this->get(route('gallery-item.show', $galleryItem));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\GalleryItemController::class,
            'update',
            \App\Http\Requests\GalleryItemUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $galleryItem = GalleryItem::factory()->create();
        $type = $this->faker->numberBetween(-8, 8);
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->put(route('gallery-item.update', $galleryItem), [
            'type' => $type,
            'position' => $position,
            'status' => $status,
        ]);

        $galleryItem->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($type, $galleryItem->type);
        $this->assertEquals($position, $galleryItem->position);
        $this->assertEquals($status, $galleryItem->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $galleryItem = GalleryItem::factory()->create();

        $response = $this->delete(route('gallery-item.destroy', $galleryItem));

        $response->assertNoContent();

        $this->assertSoftDeleted($galleryItem);
    }
}
