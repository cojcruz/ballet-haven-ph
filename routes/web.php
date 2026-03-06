<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Cms\BlockController;
use App\Http\Controllers\Cms\PageController;
use App\Http\Controllers\Cms\PublicController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PublicController::class, 'home'])->name('home');

Route::get('/p/{slug}', [PublicController::class, 'show'])->name('cms.public.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])
    ->prefix('dashboard/cms')
    ->name('cms.')
    ->group(function () {
        Route::get('/pages', [PageController::class, 'index'])->name('pages.index');
        Route::get('/pages/create', [PageController::class, 'create'])->name('pages.create');
        Route::post('/pages', [PageController::class, 'store'])->name('pages.store');
        Route::get('/pages/{page}/edit', [PageController::class, 'edit'])->name('pages.edit');
        Route::put('/pages/{page}', [PageController::class, 'update'])->name('pages.update');
        Route::delete('/pages/{page}', [PageController::class, 'destroy'])->name('pages.destroy');

        Route::post('/pages/{page}/blocks', [BlockController::class, 'store'])->name('blocks.store');
        Route::put('/pages/{page}/blocks/{block}', [BlockController::class, 'update'])->name('blocks.update');
        Route::delete('/pages/{page}/blocks/{block}', [BlockController::class, 'destroy'])->name('blocks.destroy');
    });

Route::middleware(['auth', 'verified'])
    ->prefix('dashboard/events')
    ->name('events.')
    ->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('index');
        Route::get('/create', [EventController::class, 'create'])->name('create');
        Route::post('/', [EventController::class, 'store'])->name('store');
        Route::get('/{event}/edit', [EventController::class, 'edit'])->name('edit');
        Route::put('/{event}', [EventController::class, 'update'])->name('update');
        Route::delete('/{event}', [EventController::class, 'destroy'])->name('destroy');
    });

Route::get('/api/events', [EventController::class, 'publicIndex'])->name('api.events');

Route::middleware(['auth', 'verified'])
    ->prefix('dashboard/forms')
    ->name('forms.')
    ->group(function () {
        Route::get('/', [FormController::class, 'index'])->name('index');
        Route::get('/create', [FormController::class, 'create'])->name('create');
        Route::post('/', [FormController::class, 'store'])->name('store');
        Route::post('/import', [FormController::class, 'import'])->name('import');
        Route::get('/{form}/edit', [FormController::class, 'edit'])->name('edit');
        Route::put('/{form}', [FormController::class, 'update'])->name('update');
        Route::delete('/{form}', [FormController::class, 'destroy'])->name('destroy');
        Route::get('/{form}/submissions', [FormController::class, 'submissions'])->name('submissions');
        Route::get('/{form}/submissions/{submission}', [FormController::class, 'showSubmission'])->name('submissions.show');
        Route::get('/{form}/submissions-export', [FormController::class, 'exportSubmissions'])->name('submissions.export');
        Route::get('/{form}/export', [FormController::class, 'export'])->name('export');
    });

Route::get('/form/{slug}', [FormController::class, 'showPublic'])->name('forms.public.show');
Route::post('/form/{slug}', [FormController::class, 'submitPublic'])->name('forms.public.submit');
Route::get('/form/{slug}/embed', [FormController::class, 'embed'])->name('forms.public.embed');

require __DIR__.'/auth.php';
