<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $impersonating = session('impersonate_original_user_id') ? true : false;
        $originalUser = null;
        
        if ($impersonating) {
            $originalUser = User::find(session('impersonate_original_user_id'));
        }

        return Inertia::render('Users/Index', [
            'users' => User::query()
                ->with('roleRelation')
                ->select(['id', 'name', 'email', 'email_verified_at', 'role', 'role_id', 'created_at'])
                ->orderBy('name')
                ->get(),
            'roles' => \App\Models\Role::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
            'impersonating' => $impersonating,
            'originalUser' => $originalUser,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        $newRole = \App\Models\Role::find($validated['role_id']);
        $authUser = $request->user();
        
        if ($authUser && (int) $authUser->id === (int) $user->id && $newRole->slug !== 'admin') {
            return back()->with('error', 'You cannot remove your own admin role.');
        }

        $user->role_id = $validated['role_id'];
        $user->role = $newRole->slug;
        $user->save();

        return back()->with('success', 'User updated.');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        $role = \App\Models\Role::find($validated['role_id']);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'role' => $role->slug,
        ]);

        event(new Registered($user));

        return back()->with('success', 'User created successfully.');
    }

    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->password = Hash::make($validated['password']);
        $user->save();

        return back()->with('success', 'Password updated successfully.');
    }

    public function impersonate(Request $request, User $user): RedirectResponse
    {
        $originalUser = $request->user();
        
        if (!$originalUser || !$originalUser->isAdmin()) {
            abort(403);
        }

        if ((int) $originalUser->id === (int) $user->id) {
            return back()->with('error', 'You cannot impersonate yourself.');
        }

        session(['impersonate_original_user_id' => $originalUser->id]);
        Auth::login($user);

        return redirect()->route('dashboard')->with('success', "Now impersonating {$user->name}.");
    }

    public function stopImpersonating(Request $request): RedirectResponse
    {
        $originalUserId = session('impersonate_original_user_id');
        
        if (!$originalUserId) {
            return redirect()->route('dashboard');
        }

        $originalUser = User::find($originalUserId);
        
        if (!$originalUser) {
            session()->forget('impersonate_original_user_id');
            return redirect()->route('dashboard')->with('error', 'Original user not found.');
        }

        session()->forget('impersonate_original_user_id');
        Auth::login($originalUser);

        return redirect()->route('users.index')->with('success', 'Stopped impersonating.');
    }
}
