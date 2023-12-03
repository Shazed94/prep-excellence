<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\EmployeeWorking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\EmployeeWorkingController
 */
class EmployeeWorkingControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $employeeWorkings = EmployeeWorking::factory()->count(3)->create();

        $response = $this->get(route('employee-working.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeeWorkingController::class,
            'store',
            \App\Http\Requests\EmployeeWorkingStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $working_hour = $this->faker->randomFloat(/** double_attributes **/);
        $hour_rate = $this->faker->randomFloat(/** double_attributes **/);
        $is_paid = $this->faker->boolean;

        $response = $this->post(route('employee-working.store'), [
            'working_hour' => $working_hour,
            'hour_rate' => $hour_rate,
            'is_paid' => $is_paid,
        ]);

        $employeeWorkings = EmployeeWorking::query()
            ->where('working_hour', $working_hour)
            ->where('hour_rate', $hour_rate)
            ->where('is_paid', $is_paid)
            ->get();
        $this->assertCount(1, $employeeWorkings);
        $employeeWorking = $employeeWorkings->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $employeeWorking = EmployeeWorking::factory()->create();

        $response = $this->get(route('employee-working.show', $employeeWorking));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeeWorkingController::class,
            'update',
            \App\Http\Requests\EmployeeWorkingUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $employeeWorking = EmployeeWorking::factory()->create();
        $working_hour = $this->faker->randomFloat(/** double_attributes **/);
        $hour_rate = $this->faker->randomFloat(/** double_attributes **/);
        $is_paid = $this->faker->boolean;

        $response = $this->put(route('employee-working.update', $employeeWorking), [
            'working_hour' => $working_hour,
            'hour_rate' => $hour_rate,
            'is_paid' => $is_paid,
        ]);

        $employeeWorking->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($working_hour, $employeeWorking->working_hour);
        $this->assertEquals($hour_rate, $employeeWorking->hour_rate);
        $this->assertEquals($is_paid, $employeeWorking->is_paid);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $employeeWorking = EmployeeWorking::factory()->create();

        $response = $this->delete(route('employee-working.destroy', $employeeWorking));

        $response->assertNoContent();

        $this->assertSoftDeleted($employeeWorking);
    }
}
