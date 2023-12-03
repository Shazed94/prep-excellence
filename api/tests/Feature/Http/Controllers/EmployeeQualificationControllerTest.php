<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\EmployeeQualification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\EmployeeQualificationController
 */
class EmployeeQualificationControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $employeeQualifications = EmployeeQualification::factory()->count(3)->create();

        $response = $this->get(route('employee-qualification.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeeQualificationController::class,
            'store',
            \App\Http\Requests\EmployeeQualificationStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $is_active = $this->faker->boolean;

        $response = $this->post(route('employee-qualification.store'), [
            'is_active' => $is_active,
        ]);

        $employeeQualifications = EmployeeQualification::query()
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $employeeQualifications);
        $employeeQualification = $employeeQualifications->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $employeeQualification = EmployeeQualification::factory()->create();

        $response = $this->get(route('employee-qualification.show', $employeeQualification));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeeQualificationController::class,
            'update',
            \App\Http\Requests\EmployeeQualificationUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $employeeQualification = EmployeeQualification::factory()->create();
        $is_active = $this->faker->boolean;

        $response = $this->put(route('employee-qualification.update', $employeeQualification), [
            'is_active' => $is_active,
        ]);

        $employeeQualification->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($is_active, $employeeQualification->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $employeeQualification = EmployeeQualification::factory()->create();

        $response = $this->delete(route('employee-qualification.destroy', $employeeQualification));

        $response->assertNoContent();

        $this->assertSoftDeleted($employeeQualification);
    }
}
