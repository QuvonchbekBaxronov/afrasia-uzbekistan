<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

use App\Http\Requests\ContactRequest;

class ContactController extends Controller
{
    public function store(ContactRequest $request)
    {
        Contact::create($request->validated());

        return redirect('/contact')->with('success', 'Xabar muvaffaqiyatli yuborildi!');
    }
}
