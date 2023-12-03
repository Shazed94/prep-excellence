<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\EmployeeController
 */
class EmployeeControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $employees = Employee::factory()->count(3)->create();

        $response = $this->get(route('employee.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeeController::class,
            'store',
            \App\Http\Requests\EmployeeStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $emergency_contact = $this->faker->word;
        $is_active = $this->faker->boolean;

        $response = $this->post(route('employee.store'), [
            'emergency_contact' => $emergency_contact,
            'is_active' => $is_active,
        ]);

        $employees = Employee::query()
            ->where('emergency_contact', $emergency_contact)
            ->where('is_active', $is_active)
            ->get();
        $this->assertCount(1, $employees);
        $employee = $employees->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $employee = Employee::factory()->create();

        $response = $this->get(route('employee.show', $employee));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeeController::class,
            'update',
            \App\Http\Requests\EmployeeUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $employee = Employee::factory()->create();
        $emergency_contact = $this->faker->word;
        $is_active = $this->faker->boolean;

        $response = $this->put(route('employee.update', $employee), [
            'emergency_contact' => $emergency_contact,
            'is_active' => $is_active,
        ]);

        $employee->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($emergency_contact, $employee->emergency_contact);
        $this->assertEquals($is_active, $employee->is_active);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $employee = Employee::factory()->create();

        $response = $this->delete(route('employee.destroy', $employee));

        $response->assertNoContent();

        $this->assertSoftDeleted($employee);
    }
}
