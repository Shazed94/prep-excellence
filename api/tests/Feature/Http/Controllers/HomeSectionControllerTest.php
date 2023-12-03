<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\HomeSection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\HomeSectionController
 */
class HomeSectionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $homeSections = HomeSection::factory()->count(3)->create();

        $response = $this->get(route('home-section.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\HomeSectionController::class,
            'store',
            \App\Http\Requests\HomeSectionStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $section_name = $this->faker->word;
        $section_name_is_show = $this->faker->boolean;
        $bg_type = $this->faker->numberBetween(-8, 8);
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->post(route('home-section.store'), [
            'section_name' => $section_name,
            'section_name_is_show' => $section_name_is_show,
            'bg_type' => $bg_type,
            'position' => $position,
            'status' => $status,
        ]);

        $homeSections = HomeSection::query()
            ->where('section_name', $section_name)
            ->where('section_name_is_show', $section_name_is_show)
            ->where('bg_type', $bg_type)
            ->where('position', $position)
            ->where('status', $status)
            ->get();
        $this->assertCount(1, $homeSections);
        $homeSection = $homeSections->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $homeSection = HomeSection::factory()->create();

        $response = $this->get(route('home-section.show', $homeSection));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\HomeSectionController::class,
            'update',
            \App\Http\Requests\HomeSectionUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $homeSection = HomeSection::factory()->create();
        $section_name = $this->faker->word;
        $section_name_is_show = $this->faker->boolean;
        $bg_type = $this->faker->numberBetween(-8, 8);
        $position = $this->faker->numberBetween(-10000, 10000);
        $status = $this->faker->boolean;

        $response = $this->put(route('home-section.update', $homeSection), [
            'section_name' => $section_name,
            'section_name_is_show' => $section_name_is_show,
            'bg_type' => $bg_type,
            'position' => $position,
            'status' => $status,
        ]);

        $homeSection->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($section_name, $homeSection->section_name);
        $this->assertEquals($section_name_is_show, $homeSection->section_name_is_show);
        $this->assertEquals($bg_type, $homeSection->bg_type);
        $this->assertEquals($position, $homeSection->position);
        $this->assertEquals($status, $homeSection->status);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $homeSection = HomeSection::factory()->create();

        $response = $this->delete(route('home-section.destroy', $homeSection));

        $response->assertNoContent();

        $this->assertSoftDeleted($homeSection);
    }
}
