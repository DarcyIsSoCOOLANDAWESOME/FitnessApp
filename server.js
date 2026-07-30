"use strict";

const Hapi = require("@hapi/hapi");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const init = async () => {
  const server = Hapi.Server({
    host: "localhost",
    port: 1234,
  });

  server.route([
    {
      method: "GET",
      path: "/user",
      handler: async () => {
        return await prisma.user.findMany();
      },
    },

    {
      method: "GET",
      path: "/health",
      handler: () => {
        return "health status ok";
      },
    },

    {
      method: "GET",
      path: "/workout-exercise",
      handler: async () => {
        try {
          const result = await prisma.workoutExercise.findMany();
          return result;
        } catch (err) {
          console.error(err);
          return {
            name: err.name,
            message: err.message,
            code: err.code,
            meta: err.meta,
          };
        }
      },
    },
  ]);

  await server.start();
  console.log(`Server started on: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
