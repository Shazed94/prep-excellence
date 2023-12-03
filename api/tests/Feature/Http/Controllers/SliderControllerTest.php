<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Slider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\SliderController
 */
class SliderControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $sliders = Slider::factory()->count(3)->create();

        $response = $this->get(route('slider.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SliderController::class,
            'store',
            \App\Http\Requests\SliderStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $status = $this->faker->boolean;
        $position = $this->faker->numberBetween(-10000, 10000);
        $slider_type = $this->faker->numberBetween(-8, 8);

        $response = $this->post(route('slider.store'), [
            'status' => $status,
            'position' => $position,
            'slider_type' => $slider_type,
        ]);

        $sliders = Slider::query()
            ->where('status', $status)
            ->where('position', $position)
            ->where('slider_type', $slider_type)
            ->get();
        $this->assertCount(1, $sliders);
        $slider = $sliders->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $slider = Slider::factory()->create();

        $response = $this->get(route('slider.show', $slider));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SliderController::class,
            'update',
            \App\Http\Requests\SliderUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $slider = Slider::factory()->create();
        $status = $this->faker->boolean;
        $position = $this->faker->numberBetween(-10000, 10000);
        $slider_type = $this->faker->numberBetween(-8, 8);

        $response = $this->put(route('slider.update', $slider), [
            'status' => $status,
            'position' => $position,
            'slider_type' => $slider_type,
        ]);

        $slider->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($status, $slider->status);
        $this->assertEquals($position, $slider->position);
        $this->assertEquals($slider_type, $slider->slider_type);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $slider = Slider::factory()->create();

        $response = $this->delete(route('slider.destroy', $slider));

        $response->assertNoContent();

        $this->assertSoftDeleted($slider);
    }
}
