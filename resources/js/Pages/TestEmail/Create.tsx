import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, Send, ArrowLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        to: '',
        subject: 'Test Email from Ballet Haven',
        message: 'This is a test email sent from the Ballet Haven application to verify that the email configuration is working correctly.',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('test-email.send'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('dashboard')}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Send Test Email
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Send Test Email" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <Mail className="h-8 w-8 text-gray-600" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Test Email Configuration
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Send a test email to verify your mail configuration is working correctly.
                                    </p>
                                </div>
                            </div>

                            {recentlySuccessful && (
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-800">
                                        ✓ Test email sent successfully!
                                    </p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                                        Recipient Email
                                    </label>
                                    <input
                                        id="to"
                                        type="email"
                                        value={data.to}
                                        onChange={(e) => setData('to', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="recipient@example.com"
                                        required
                                    />
                                    {errors.to && (
                                        <p className="mt-2 text-sm text-red-600">{errors.to}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                        Subject
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.subject && (
                                        <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows={6}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.message && (
                                        <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="h-4 w-4" />
                                        Send Test Email
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Mail Configuration Info</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Mail Service:</strong> NodeMailer</p>
                                <p><strong>Mail Provider:</strong> Live Mailtrap</p>
                                <p><strong>Environment:</strong> Production</p>
                                <p><strong>From Address:</strong> {import.meta.env.MAIL_FROM_NAME + ' <' + import.meta.env.MAIL_FROM_ADDRESS + '>'}</p>
                                <p><strong>Mail Server:</strong> http://localhost:3001</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
