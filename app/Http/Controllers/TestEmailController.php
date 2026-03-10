<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TestEmailController extends Controller
{
    public function create()
    {
        return inertia('TestEmail/Create');
    }

    public function send(Request $request)
    {
        $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            // Call NodeMailer service
            $response = Http::post('http://localhost:3001/send-test-email', [
                'to' => $request->to,
                'subject' => $request->subject,
                'message' => $request->message,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Log the mail details for debugging
                Log::info('Test email sent via NodeMailer', [
                    'to' => $request->to,
                    'subject' => $request->subject,
                    'message_id' => $data['message_id'] ?? null,
                    'preview_url' => $data['preview'] ?? null,
                ]);

                $successMessage = 'Test email sent successfully!';
                if (isset($data['preview'])) {
                    $successMessage .= ' Preview: ' . $data['preview'];
                }

                return back()->with('success', $successMessage);
            } else {
                $errorData = $response->json();
                $errorMessage = $errorData['error'] ?? 'Unknown error occurred';
                
                Log::error('NodeMailer service error', [
                    'status' => $response->status(),
                    'response' => $errorData,
                ]);

                return back()->with('error', 'Failed to send email: ' . $errorMessage);
            }
        } catch (\Exception $e) {
            Log::error('Exception when calling NodeMailer service', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }
}
