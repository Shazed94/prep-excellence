<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\PushNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\PushNotificationController
 */
class PushNotificationControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $pushNotifications = PushNotification::factory()->count(3)->create();

        $response = $this->get(route('push-notification.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PushNotificationController::class,
            'store',
            \App\Http\Requests\PushNotificationStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $is_seen = $this->faker->boolean;

        $response = $this->post(route('push-notification.store'), [
            'is_seen' => $is_seen,
        ]);

        $pushNotifications = PushNotification::query()
            ->where('is_seen', $is_seen)
            ->get();
        $this->assertCount(1, $pushNotifications);
        $pushNotification = $pushNotifications->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $pushNotification = PushNotification::factory()->create();

        $response = $this->get(route('push-notification.show', $pushNotification));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PushNotificationController::class,
            'update',
            \App\Http\Requests\PushNotificationUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $pushNotification = PushNotification::factory()->create();
        $is_seen = $this->faker->boolean;

        $response = $this->put(route('push-notification.update', $pushNotification), [
            'is_seen' => $is_seen,
        ]);

        $pushNotification->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($is_seen, $pushNotification->is_seen);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $pushNotification = PushNotification::factory()->create();

        $response = $this->delete(route('push-notification.destroy', $pushNotification));

        $response->assertNoContent();

        $this->assertSoftDeleted($pushNotification);
    }
}
