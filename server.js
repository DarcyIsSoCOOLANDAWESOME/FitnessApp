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
      path: "/workout-exercise",
      handler: async () => {
        // console.log("STEP 1");
        await prisma.$connect();
        // console.log("STEP 2 - connected");
        const result = await prisma.$queryRaw`
      SELECT * FROM public."workoutExercise"
    `;

        console.log("STEP 3");
        console.log(result);

        return result;
      },
    },
    {
      method: "POST",
      path: "/user",
      handler: async (request, h) => {
        const { name, email } = request.payload;

        const user = await prisma.user.create({
          data: {
            name,
            email,
          },
        });

        return user;
      },
    },
    {
      method: "DELETE",
      path: "/workout-exercise",
      handler: async (request, h) => {},
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
      path: "/exercises",
      handler: async () => {
        const response = await fetch(
          "https://wger.de/api/v2/exercise/?language=2",
        );

        const data = await response.json();

        return data;
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
