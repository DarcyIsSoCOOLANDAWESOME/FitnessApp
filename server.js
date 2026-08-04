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

    //In order for this page to work, I have to write out raw SQL? It won't work like the above /user
    {
      method: "GET",
      path: "/workout-exercise",
      handler: async () => {
        return await prisma.workoutExercise();
      },
    },
    //Cannot get this POST to work, 500 internal server error. Could be naming conventions?
    {
      method: "POST",
      path: "/workout-exercise",
      handler: async (request, h) => {
        const { workoutId, wgerExerciseId, sets, reps, weight } =
          request.payload;
        try {
          const workoutExercise = await prisma.workoutExercise.create({
            data: { workoutId, wgerExerciseId, sets, reps, weight },
          });
          return workoutExercise;
        } catch (err) {
          // add console error
          console.error(err);
          return h.response({ error: err.message }).code(500);
        }
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
    // {
    //   method: "DELETE",
    //   path: "/user",
    //   handler: async (request, h) => {},
    // },
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
