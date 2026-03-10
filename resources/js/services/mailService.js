import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        // Mailtrap configuration for development
        const config = {
            host: import.meta.env.VITE_MAIL_HOST || 'sandbox.smtp.mailtrap.io',
            port: parseInt(import.meta.env.VITE_MAIL_PORT) || 2525,
            secure: false, // true for 465, false for other ports
            auth: {
                user: import.meta.env.VITE_MAIL_USERNAME || '',
                pass: import.meta.env.VITE_MAIL_PASSWORD || ''
            }
        };

        this.transporter = nodemailer.createTransporter(config);
    }

    async sendTestEmail(to, subject, message) {
        try {
            const mailOptions = {
                from: `${import.meta.env.MAIL_FROM_NAME || 'Ballet Haven'} <${import.meta.env.MAIL_FROM_ADDRESS || 'no-reply@abap-inc.org'}>`,
                to: to,
                subject: subject,
                html: this.generateTestEmailHTML(subject, message)
            };

            const info = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId,
                response: info.response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    generateTestEmailHTML(subject, message) {
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
                            <li><strong>Environment:</strong> ${import.meta.env.MODE || 'development'}</li>
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

    async verifyConnection() {
        try {
            await this.transporter.verify();
            return { success: true, message: 'Mail service connection verified' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Export singleton instance
export const mailService = new MailService();
export default mailService;
