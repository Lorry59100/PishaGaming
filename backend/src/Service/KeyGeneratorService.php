<?php

namespace App\Service;

class KeyGeneratorService
{
    private function generateKey($length, $separator, $characters)
    {
        $key = '';
        for ($i = 0; $i < $length; $i++) {
            if ($i > 0 && $i % 4 === 0 && $i !== $length - 1) {
                $key .= $separator;
            }

            $randomIndex = random_int(0, strlen($characters) - 1);
            $key .= $characters[$randomIndex];
        }
        return $key;
    }

    public function generateKeyWithLength($length)
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $separator = '-';

        return $this->generateKey($length, $separator, $characters);
    }

    public function generateActivationKey($platform)
    {
        return match ($platform) {
            'PlayStation 5', 'PlayStation 4'=> $this->generateKeyWithLength(12),
            'PC', 'iOS', 'Android', 'macOS', 'Linux', 'Nintendo Switch', 'Classic Macintosh', 'Apple II'=> $this->generateKeyWithLength(16),
            'Xbox Series X', 'Xbox One', 'Xbox Series SX'=> $this->generateKeyWithLength(25),
            default => throw new \InvalidArgumentException('Plateforme non prise en charge'),
        };
    }
}
