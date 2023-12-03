<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Applicant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ApplicantController
 */
class ApplicantControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $applicants = Applicant::factory()->count(3)->create();

        $response = $this->get(route('applicant.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ApplicantController::class,
            'store',
            \App\Http\Requests\ApplicantStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $tutored_before = $this->faker->boolean;

        $response = $this->post(route('applicant.store'), [
            'tutored_before' => $tutored_before,
        ]);

        $applicants = Applicant::query()
            ->where('tutored_before', $tutored_before)
            ->get();
        $this->assertCount(1, $applicants);
        $applicant = $applicants->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $applicant = Applicant::factory()->create();

        $response = $this->get(route('applicant.show', $applicant));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ApplicantController::class,
            'update',
            \App\Http\Requests\ApplicantUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $applicant = Applicant::factory()->create();
        $tutored_before = $this->faker->boolean;

        $response = $this->put(route('applicant.update', $applicant), [
            'tutored_before' => $tutored_before,
        ]);

        $applicant->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($tutored_before, $applicant->tutored_before);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $applicant = Applicant::factory()->create();

        $response = $this->delete(route('applicant.destroy', $applicant));

        $response->assertNoContent();

        $this->assertSoftDeleted($applicant);
    }
}
