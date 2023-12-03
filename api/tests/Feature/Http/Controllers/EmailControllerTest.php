<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Email;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\EmailController
 */
class EmailControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $emails = Email::factory()->count(3)->create();

        $response = $this->get(route('email.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmailController::class,
            'store',
            \App\Http\Requests\EmailStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $email = $this->faker->safeEmail;

        $response = $this->post(route('email.store'), [
            'email' => $email,
        ]);

        $emails = Email::query()
            ->where('email', $email)
            ->get();
        $this->assertCount(1, $emails);
        $email = $emails->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $email = Email::factory()->create();

        $response = $this->get(route('email.show', $email));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EmailController::class,
            'update',
            \App\Http\Requests\EmailUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $email = Email::factory()->create();
        $email = $this->faker->safeEmail;

        $response = $this->put(route('email.update', $email), [
            'email' => $email,
        ]);

        $email->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($email, $email->email);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $email = Email::factory()->create();

        $response = $this->delete(route('email.destroy', $email));

        $response->assertNoContent();

        $this->assertSoftDeleted($email);
    }
}
