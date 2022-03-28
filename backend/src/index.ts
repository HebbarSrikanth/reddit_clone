import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/HelloResolvers";
import { PostResolver } from "./resolvers/PostResolvers";
import { UserResolver } from "./resolvers/UserResolver";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";

const main = async () => {
  //Database connection
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  //Server connection
  const app = express();

  //Redis connection
  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years max age
        httpOnly: true, //security resaon it doesn't allow cookie to be accessible from front end
        secure: true, //cookie only is used in https
        // sameSite: "lax", //csrf
        sameSite: "none",
      },
      saveUninitialized: false,
      secret: "root@123",
      resave: false,
    })
  );

  //Apollo server connection
  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  //Apply middleware will create a graphql endpoint for us
  await apollo.start();
  apollo.applyMiddleware({
    app,
    cors: { credentials: true, origin: "https://studio.apollographql.com" },
  });

  app.set("trust proxy", process.env.NODE_ENV !== __prod__.toString());
  app.listen(4000, () => {
    console.log("Server is listening in the port 4000");
  });
};

main();
