<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $impersonating = session('impersonate_original_user_id') ? true : false;
        $originalUser = null;
        
        if ($impersonating) {
            $originalUser = \App\Models\User::find(session('impersonate_original_user_id'));
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'impersonating' => $impersonating,
                'originalUser' => $originalUser,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
