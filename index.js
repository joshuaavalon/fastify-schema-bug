const fastify = require("fastify");
const { Type } = require("@sinclair/typebox");

const bodySchema = Type.Object({
  data: Type.Number()
});

const errorSchema = Type.Object({
  code: Type.Literal("APP_ERROR"),
  message: Type.String()
});

async function main() {
  const app = fastify();
  app.route({
    method: "POST",
    url: "/",
    schema: {
      body: bodySchema,
      response: {
        400: errorSchema
      }
    },
    async handler(req, res) {
      const error = {
        code: "APP_ERROR",
        message: "Unknown app error"
      };
      return res.code(400).send(error);
    }
  });
  app.setErrorHandler((err, req, res) => {
    const { validation } = err;
    if (!validation) {
      return res.code(500).send({
        code: "SYSTEM_ERROR",
        message: "Unknown system error"
      });
    }
    return res
      .status(400)
      .send({ code: "CUSTOM_ERROR", message: "Unknown custom error" });
  });
  app.listen({ port: 3000 }, (err) => {
    if (err) {
      fastify.log.fatal(err);
      process.exit(1);
    }
  });
}

main();
