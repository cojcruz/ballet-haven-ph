<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        $role = (string) ($user->role ?? 'viewer');

        if (count($roles) > 0 && ! in_array($role, $roles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
