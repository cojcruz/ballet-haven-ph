const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.MAIL_SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mail transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.MAIL_PORT) || 2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME || '',
        pass: process.env.MAIL_PASSWORD || ''
    },
    // Add TLS support for Live Mailtrap
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Mail transporter configuration error:', error);
    } else {
        console.log('Mail server is ready to send messages');
    }
});

// Send test email endpoint
app.post('/send-test-email', async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, message'
            });
        }

        const mailOptions = {
            from: `${process.env.MAIL_FROM_NAME || 'Ballet Haven'} <${process.env.MAIL_FROM_ADDRESS || 'no-reply@abap-inc.org'}>`,
            to: to,
            subject: subject,
            html: generateTestEmailHTML(subject, message, to)
        };

        const info = await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            messageId: info.messageId,
            response: info.response,
            preview: nodemailer.getTestMessageUrl(info) // Mailtrap preview URL
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'NodeMailer Mail Server',
        timestamp: new Date().toISOString()
    });
});

// Generate test email HTML
function generateTestEmailHTML(subject, message, to) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
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
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding: 20px;
                    background: #f0f0f0;
                    border-radius: 10px;
                    font-size: 12px;
                    color: #666;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🩰 Ballet Haven</div>
                <div>Test Email Service</div>
            </div>
            
            <div class="content">
                <h2>${subject}</h2>
                <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: #e8f4fd; border-radius: 5px;">
                    <h3>Email Configuration Test</h3>
                    <p>This is a test email sent from the Ballet Haven application to verify that the email configuration is working correctly.</p>
                    <ul>
                        <li><strong>Mail Service:</strong> NodeMailer</li>
                        <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
                        <li><strong>Sent At:</strong> ${new Date().toLocaleString()}</li>
                        <li><strong>To:</strong> ${to}</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>© 2026 Ballet Haven - Association of Ballet Academies of the Philippines</p>
                <p>This is an automated test email. Please do not reply to this message.</p>
            </div>
        </body>
        </html>
    `;
}

// Start server
app.listen(PORT, () => {
    console.log(`NodeMailer mail server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
