<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactStoreRequest;
use App\Http\Requests\ContactUpdateRequest;
use App\Http\Resources\ContactCollection;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \App\Http\Resources\ContactCollection
     */
    public function index(Request $request)
    {
        $itemsPerPage = request('per_page') ?? 20;
        $search = request('search');
        $contacts = Contact::query();
        if ($search) {
            $contacts->whereLike(['first_name','last_name','email','phone_number','subject','message'], $search);
        }
        return new ContactCollection($contacts->orderBy('id','DESC')->paginate($itemsPerPage));
    }

    /**
     * @param \App\Http\Requests\ContactStoreRequest $request
     * @return \App\Http\Resources\ContactResource
     */
    public function store(ContactStoreRequest $request)
    {
        $contact = Contact::create($request->validated());

        return new ContactResource($contact);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Contact $contact
     * @return \App\Http\Resources\ContactResource
     */
    public function show(Request $request, Contact $contact)
    {
        return new ContactResource($contact);
    }

    /**
     * @param \App\Http\Requests\ContactUpdateRequest $request
     * @param \App\Models\Contact $contact
     * @return \App\Http\Resources\ContactResource
     */
    public function update(ContactUpdateRequest $request, Contact $contact)
    {
        $contact->update($request->validated());

        return new ContactResource($contact);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Contact $contact
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Contact $contact)
    {
        $contact->delete();

        return response()->json(['status'=>'success','message'=>'Successfully removed'],200);
    }
}
