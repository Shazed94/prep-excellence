<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CategoryController
 */
class CategoryControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;
    private $url = '/api/category/';
    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $categories = Category::factory()->count(3)->create();

        $response = $this->get($this->url);

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CategoryController::class,
            'store',
            \App\Http\Requests\CategoryStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $status = $this->faker->boolean;
        $fetcher = $this->faker->boolean;
        $fetcher_position = $this->faker->numberBetween(-10000, 10000);

        $response = $this->post($this->url, [
            'status' => $status,
            'fetcher' => $fetcher,
            'fetcher_position' => $fetcher_position,
        ]);

        $categories = Category::query()
            ->where('status', $status)
            ->where('fetcher', $fetcher)
            ->where('fetcher_position', $fetcher_position)
            ->get();
        $this->assertCount(1, $categories);
        $category = $categories->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $category = Category::factory()->create();

        $response = $this->get($this->url.$category);

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\CategoryController::class,
            'update',
            \App\Http\Requests\CategoryUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $category = Category::factory()->create();
        $status = $this->faker->boolean;
        $fetcher = $this->faker->boolean;
        $fetcher_position = $this->faker->numberBetween(-10000, 10000);

        $response = $this->put($this->url.$category->id, [
            'status' => $status,
            'fetcher' => $fetcher,
            'fetcher_position' => $fetcher_position,
        ]);

        $category->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($status, $category->status);
        $this->assertEquals($fetcher, $category->fetcher);
        $this->assertEquals($fetcher_position, $category->fetcher_position);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $category = Category::factory()->create();

        $response = $this->delete($this->url.$category->id);

        $response->assertNoContent();

        $this->assertSoftDeleted($category);
    }
}
