<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4B5563;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
            border-top: none;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Test Email</h1>
    </div>
    
    <div class="content">
        <p>This is a test email sent from {{ config('app.name') }}.</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Message:</h3>
            <p>{{ $message }}</p>
        </div>
        
        <p><strong>Sent at:</strong> {{ now()->format('Y-m-d H:i:s') }}</p>
        <p><strong>Environment:</strong> {{ config('app.env') }}</p>
    </div>
    
    <div class="footer">
        <p>This email was sent using the {{ config('mail.default') }} mail driver.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>
