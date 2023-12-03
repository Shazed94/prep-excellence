<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\HomeWork;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\HomeWorkController
 */
class HomeWorkControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $homeWork = HomeWork::factory()->count(3)->create();

        $response = $this->get(route('home-work.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\HomeWorkController::class,
            'store',
            \App\Http\Requests\HomeWorkStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $total_mark = $this->faker->randomFloat(/** double_attributes **/);
        $is_active = $this->faker->boolean;

        $response = $this->post(route('home-work.store'), [
            'total_mark' => $total_mark,
            'is_active' => $is_active,
        ]);

        $homeWork = HomeWork::query()
            ->where('total_mark', $total_mark)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $homeWork);
        $homeWork = $homeWork->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $homeWork = HomeWork::factory()->create();

        $response = $this->get(route('home-work.show', $homeWork));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\HomeWorkController::class,
            'update',
            \App\Http\Requests\HomeWorkUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $homeWork = HomeWork::factory()->create();
        $total_mark = $this->faker->randomFloat(/** double_attributes **/);
        $is_active = $this->faker->boolean;

        $response = $this->put(route('home-work.update', $homeWork), [
            'total_mark' => $total_mark,
            'is_active' => $is_active,
        ]);

        $homeWork->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($total_mark, $homeWork->total_mark);
        $this->assertEquals($is_active, $homeWork->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $homeWork = HomeWork::factory()->create();

        $response = $this->delete(route('home-work.destroy', $homeWork));

        $response->assertNoContent();

        $this->assertSoftDeleted($homeWork);
    }
}
