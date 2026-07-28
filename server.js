"use strict";

const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.Server({
    host: "localhost",
    port: 1234,
  });

  server.route({
    method: "GET",
    path: "/name",
    handler: async () => {
      const name = await prisma.name.findMany();

      return name;
    },
  });

  await server.start();
  console.log(`Server started on: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
