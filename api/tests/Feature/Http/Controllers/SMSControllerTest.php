<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\SMS;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\SMSController
 */
class SMSControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $sMS = SMS::factory()->count(3)->create();

        $response = $this->get(route('s-m-s.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SMSController::class,
            'store',
            \App\Http\Requests\SMSStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $try = $this->faker->numberBetween(-8, 8);
        $is_sent = $this->faker->numberBetween(-8, 8);

        $response = $this->post(route('s-m-s.store'), [
            'try' => $try,
            'is_sent' => $is_sent,
        ]);

        $sMS = SMS::query()
            ->where('try', $try)
            ->where('is_sent', $is_sent)
            ->get();
        $this->assertCount(1, $sMS);
        $sMS = $sMS->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $sMS = SMS::factory()->create();

        $response = $this->get(route('s-m-s.show', $sMS));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\SMSController::class,
            'update',
            \App\Http\Requests\SMSUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $sMS = SMS::factory()->create();
        $try = $this->faker->numberBetween(-8, 8);
        $is_sent = $this->faker->numberBetween(-8, 8);

        $response = $this->put(route('s-m-s.update', $sMS), [
            'try' => $try,
            'is_sent' => $is_sent,
        ]);

        $sMS->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($try, $sMS->try);
        $this->assertEquals($is_sent, $sMS->is_sent);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $sMS = SMS::factory()->create();

        $response = $this->delete(route('s-m-s.destroy', $sMS));

        $response->assertNoContent();

        $this->assertSoftDeleted($sMS);
    }
}
