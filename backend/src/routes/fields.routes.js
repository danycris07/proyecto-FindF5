import { Router } from "express";
import { createRequireAuth } from "../middleware/require-auth.js";

export function createFieldsRouter({ models }) {
  const router = Router();
  router.use(createRequireAuth(models));

  router.get("/", async (_request, response) => {
    const fields = await models.Field.findAll({
      attributes: ["id", "name", "address", "imageUrl"],
      order: [["name", "ASC"]],
    });

    return response.json(
      fields.map(({ id, name, address, imageUrl }) => ({
        id,
        name,
        address,
        imageUrl,
      })),
    );
  });

  return router;
}
