<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231125145433 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product DROP INDEX UNIQ_D34A04AD74281A5E, ADD INDEX IDX_D34A04AD74281A5E (edition_id)');
        $this->addSql('ALTER TABLE product CHANGE edition_id edition_id INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product DROP INDEX IDX_D34A04AD74281A5E, ADD UNIQUE INDEX UNIQ_D34A04AD74281A5E (edition_id)');
        $this->addSql('ALTER TABLE product CHANGE edition_id edition_id INT NOT NULL');
    }
}
