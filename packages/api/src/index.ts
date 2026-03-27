import "dotenv/config";

import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

import config from "./config";
import { prisma } from "./db/prisma";
import { schema } from "./schema";

const bootstrap = async () => {
  await prisma.$connect();

  const yoga = createYoga({
    schema,
    graphiql: config.isDev,
  });

  const server = createServer((req, res) => {
    void yoga(req, res);
  });

  const port = process.env.PORT ?? "4000";

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/graphql`);
  });
};

void bootstrap();
