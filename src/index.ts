import { ApolloServer } from "apollo-server-express";
import pgSession from "connect-pg-simple";
import cors from "cors";
import express from "express";
import session from "express-session";
import process from "process";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Appointment } from "./entities/Appointment";
import { Horse } from "./entities/Horse";
import { User } from "./entities/User";
import { AppointmentResolver } from "./resolvers/appointment";
import { HorseResolver } from "./resolvers/horse";
import { UserResolver } from "./resolvers/user";
if (!__prod__) require("dotenv-safe/config");

const main = async () => {
  await createConnection({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User, Horse, Appointment],
  });

  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const PGConnection = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: 5432,
    database: process.env.DATABASE,
  };

  const PGSession = pgSession(session);

  const PGStoreConfig = {
    conObject: PGConnection,
    conString: process.env.PG_CONSTRING,
    tableName: "session",
  };

  app.use(
    session({
      name: COOKIE_NAME,
      store: new PGSession(PGStoreConfig),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".jemmastables.se" : undefined,
      }, // 30 Days
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HorseResolver, UserResolver, AppointmentResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log("Listening on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
