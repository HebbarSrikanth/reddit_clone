import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt?: Date = new Date();

  @Field(() => String)
  @Property({ type: "data", onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @Field(() => String)
  @Property({ type: "text" })
  username!: string;

  @Property({ type: "text" })
  password!: string;
}
