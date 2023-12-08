<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231208084833 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE activation_key (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, order_details_id INT DEFAULT NULL, activation_key VARCHAR(255) NOT NULL, INDEX IDX_C0E15CB6A76ED395 (user_id), INDEX IDX_C0E15CB68C0FA77 (order_details_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE activation_key ADD CONSTRAINT FK_C0E15CB6A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE activation_key ADD CONSTRAINT FK_C0E15CB68C0FA77 FOREIGN KEY (order_details_id) REFERENCES order_details (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE activation_key DROP FOREIGN KEY FK_C0E15CB6A76ED395');
        $this->addSql('ALTER TABLE activation_key DROP FOREIGN KEY FK_C0E15CB68C0FA77');
        $this->addSql('DROP TABLE activation_key');
    }
}
