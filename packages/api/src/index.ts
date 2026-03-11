import dotenv from "dotenv";

dotenv.config();

import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import config from "./config";
import { prisma } from "./db/prisma";
import seedDb from "./db/seed";
import { schema } from "./schema";

const bootstrap = async () => {
  await prisma.$connect();

  if (config.isDev) {
    await seedDb();
  }

  const yoga = createYoga({
    schema,
    graphiql: config.isDev,
  });

  const server = createServer(yoga);
  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/graphql`);
  });
};

bootstrap();
