import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constant";
import { Post } from "./entities/Posts";
import { User } from "./entities/User";

export default {
  dbName: "lireddit",
  user: "postgres",
  password: "root123",
  debug: !__prod__,
  type: "postgresql",
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
