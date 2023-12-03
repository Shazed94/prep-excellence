<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\ContactController
 */
class ContactControllerTest extends TestCase
{
    #use AdditionalAssertions, RefreshDatabase, WithFaker;
    use AdditionalAssertions, WithFaker;
    private $url = 'api/contact/';
    /**
     * @test
     */
    public function index_behaves_as_expected()
    {
        $contacts = Contact::factory()->count(3)->create();

        $response = $this->get('api/clear');

        $response->assertOk();
       // $response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContactController::class,
            'store',
            \App\Http\Requests\ContactStoreRequest::class
        );
    }

    /**
     * @test
     */
    public function store_saves()
    {
        $name = $this->faker->name;
        $email = $this->faker->safeEmail;

        $response = $this->post($this->url, [
            'name' => $name,
            'email' => $email,
        ]);

        $contacts = Contact::query()
            ->where('name', $name)
            ->where('email', $email)
            ->get();
        $this->assertCount(1, $contacts);
        $contact = $contacts->first();

        $response->assertCreated();
        //$response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function show_behaves_as_expected()
    {
        $contact = Contact::factory()->create();

        $response = $this->get($this->url.$contact->id);

        $response->assertOk();
        //$response->assertJsonStructure([]);
    }


    /**
     * @test
     */
    public function update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\ContactController::class,
            'update',
            \App\Http\Requests\ContactUpdateRequest::class
        );
    }

    /**
     * @test
     */
    public function update_behaves_as_expected()
    {
        $contact = Contact::factory()->create();
        $name = $this->faker->name;
        $message = $this->faker->text;
        $email = $this->faker->safeEmail;

        $response = $this->put($this->url.$contact->id, [
            'name' => $name,
            'email' => $email,
            'message' => $message,
        ]);

        $contact->refresh();

        $response->assertOk();
        //$response->assertJsonStructure([]);

        $this->assertEquals($name, $contact->name);
        $this->assertEquals($email, $contact->email);
        $this->assertEquals($message, $contact->message);
    }


    /**
     * @test
     */
    public function destroy_deletes_and_responds_with()
    {
        $contact = Contact::factory()->create();

        $response = $this->delete($this->url.$contact->id);

        $response->assertOk();

        $this->assertSoftDeleted($contact);
    }
}
