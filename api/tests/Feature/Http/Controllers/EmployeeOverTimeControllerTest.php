<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\EmployeeOverTime;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\EmployeeOverTimeController
 */
class EmployeeOverTimeControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $employeeOverTimes = EmployeeOverTime::factory()->count(3)->create();

        $response = $this->get(route('employee-over-time.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeeOverTimeController::class,
            'store',
            \App\Http\Requests\EmployeeOverTimeStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $working_hour = $this->faker->randomFloat(/** double_attributes **/);
        $hour_rate = $this->faker->randomFloat(/** double_attributes **/);
        $status = $this->faker->numberBetween(-8, 8);
        $is_paid = $this->faker->boolean;

        $response = $this->post(route('employee-over-time.store'), [
            'working_hour' => $working_hour,
            'hour_rate' => $hour_rate,
            'status' => $status,
            'is_paid' => $is_paid,
        ]);

        $employeeOverTimes = EmployeeOverTime::query()
            ->where('working_hour', $working_hour)
            ->where('hour_rate', $hour_rate)
            ->where('status', $status)
            ->where('is_paid', $is_paid)
            ->get();
        $this->assertCount(1, $employeeOverTimes);
        $employeeOverTime = $employeeOverTimes->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $employeeOverTime = EmployeeOverTime::factory()->create();

        $response = $this->get(route('employee-over-time.show', $employeeOverTime));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmployeeOverTimeController::class,
            'update',
            \App\Http\Requests\EmployeeOverTimeUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $employeeOverTime = EmployeeOverTime::factory()->create();
        $working_hour = $this->faker->randomFloat(/** double_attributes **/);
        $hour_rate = $this->faker->randomFloat(/** double_attributes **/);
        $status = $this->faker->numberBetween(-8, 8);
        $is_paid = $this->faker->boolean;

        $response = $this->put(route('employee-over-time.update', $employeeOverTime), [
            'working_hour' => $working_hour,
            'hour_rate' => $hour_rate,
            'status' => $status,
            'is_paid' => $is_paid,
        ]);

        $employeeOverTime->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($working_hour, $employeeOverTime->working_hour);
        $this->assertEquals($hour_rate, $employeeOverTime->hour_rate);
        $this->assertEquals($status, $employeeOverTime->status);
        $this->assertEquals($is_paid, $employeeOverTime->is_paid);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $employeeOverTime = EmployeeOverTime::factory()->create();

        $response = $this->delete(route('employee-over-time.destroy', $employeeOverTime));

        $response->assertNoContent();

        $this->assertSoftDeleted($employeeOverTime);
    }
}
