<?php

namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

class EmailService
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }
    public function sendWithTemplate(
        string $from,
        string $to,
        string $subject,
        string $htmlTemplate,
        array $context = null
    ): void {
        $templatedEmail = (new TemplatedEmail())
            ->from($from)
            ->to($to)
            ->subject($subject)
            ->htmlTemplate($htmlTemplate)
            ->context($context);

        $this->mailer->send($templatedEmail);
    }

    public function send(
        string $from,
        string $to,
        string $subject,
        string $text,
        string $htmlContent = null
    ): void {
        $email = (new Email())
            ->from($from)
            ->to($to)
            ->subject($subject)
            ->text($text)
            ->html($htmlContent);

        $this->mailer->send($email);
    }
}