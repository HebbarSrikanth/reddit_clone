import { Migration } from '@mikro-orm/migrations';

export class Migration20220324171705 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" varchar(255) not null, "username" text not null, "password" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
