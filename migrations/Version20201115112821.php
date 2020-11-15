<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201115112821 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE in_voice DROP FOREIGN KEY FK_AD0E4645B171EB6C');
        $this->addSql('DROP INDEX IDX_AD0E4645B171EB6C ON in_voice');
        $this->addSql('ALTER TABLE in_voice CHANGE customer_id_id customer_id INT NOT NULL');
        $this->addSql('ALTER TABLE in_voice ADD CONSTRAINT FK_AD0E46459395C3F3 FOREIGN KEY (customer_id) REFERENCES customer (id)');
        $this->addSql('CREATE INDEX IDX_AD0E46459395C3F3 ON in_voice (customer_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE in_voice DROP FOREIGN KEY FK_AD0E46459395C3F3');
        $this->addSql('DROP INDEX IDX_AD0E46459395C3F3 ON in_voice');
        $this->addSql('ALTER TABLE in_voice CHANGE customer_id customer_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE in_voice ADD CONSTRAINT FK_AD0E4645B171EB6C FOREIGN KEY (customer_id_id) REFERENCES customer (id)');
        $this->addSql('CREATE INDEX IDX_AD0E4645B171EB6C ON in_voice (customer_id_id)');
    }
}
