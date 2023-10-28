<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231025151007 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE edition_category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE edition ADD edition_category_id INT DEFAULT NULL, DROP name');
        $this->addSql('ALTER TABLE edition ADD CONSTRAINT FK_A891181F5757BB3C FOREIGN KEY (edition_category_id) REFERENCES edition_category (id)');
        $this->addSql('CREATE INDEX IDX_A891181F5757BB3C ON edition (edition_category_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE edition DROP FOREIGN KEY FK_A891181F5757BB3C');
        $this->addSql('DROP TABLE edition_category');
        $this->addSql('DROP INDEX IDX_A891181F5757BB3C ON edition');
        $this->addSql('ALTER TABLE edition ADD name VARCHAR(255) NOT NULL, DROP edition_category_id');
    }
}
