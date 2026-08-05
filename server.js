"use strict";

const Hapi = require("@hapi/hapi");
const { PrismaClient } = require("@prisma/client");
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

const init = async () => {
  const server = Hapi.Server({
    host: "localhost",
    port: port,
  });

  server.route([
    //In order for this page to work. It won't work like the above /user
    {
      method: "GET",
      path: "/workout-exercise",
      handler: async () => {
        return prisma.workouExercise.findMany();
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
      method: "PUT",
      path: "/workout-exercise",
      handler: async (request, h) => {
        const { id, workoutId, wgerExerciseId, sets, reps, weight } =
          request.payload;

        prisma.workoutExercise.update({
          where: { id },
          data: { workoutId, wgerExerciseId, sets, reps, weight },
        });
      },
    },
    {
      method: "DELETE",
      path: "/workout-exercise/{id}",
      handler: async (request, h) => {
        const id = request.params.id;

        const workoutExercise = await prisma.workoutExercise.delete({
          where: {
            id: id,
          },
        });

        return workoutExercise;
      },
    },
    {
      method: "GET",
      path: "/user",
      handler: async () => {
        return await prisma.user.findMany();
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
      method: "PUT",
      path: "/user",
      handler: async (request, h) => {
        const { id, name, email } = request.payload;
      },
    },
    {
      method: "DELETE",
      path: "/user/{id}",
      handler: async (request, h) => {
        const id = request.params.id;

        const user = await prisma.user.delete({
          where: {
            id: id,
          },
        });

        return user;
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
