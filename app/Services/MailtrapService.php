<?php

namespace App\Services;

use Mailtrap\Config;
use Mailtrap\MailtrapClient;
use Mailtrap\Mime\MailtrapEmail;
use Symfony\Component\Mime\Address;

class MailtrapService
{
    protected MailtrapClient $client;

    public function __construct()
    {
        $this->client = new MailtrapClient(
            new Config(config('services.mailtrap.api_token'))
        );
    }

    public function send(string $to, string $subject, string $html, ?string $text = null, ?string $fromEmail = null, ?string $fromName = null): void
    {
        $fromEmail = $fromEmail ?? config('mail.from.address');
        $fromName = $fromName ?? config('mail.from.name');

        $email = (new MailtrapEmail())
            ->from(new Address($fromEmail, $fromName))
            ->to(new Address($to))
            ->subject($subject)
            ->html($html);

        if ($text) {
            $email->text($text);
        }

        $this->client->sending()->emails()->send($email);
    }

    public function sendToMultiple(array $recipients, string $subject, string $html, ?string $text = null, ?string $fromEmail = null, ?string $fromName = null): void
    {
        foreach ($recipients as $recipient) {
            $this->send($recipient, $subject, $html, $text, $fromEmail, $fromName);
        }
    }
}
