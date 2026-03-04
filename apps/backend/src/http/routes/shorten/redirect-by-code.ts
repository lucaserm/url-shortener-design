import Elysia from "elysia";

import { db } from "@/db";
import { NotFoundError } from "@/errors/http/not-found-error";

export const redirectByCodeRoute = new Elysia()
  .onError((props) => console.log("LOCAL error handler called:", props.code, props.error))
  .get(
  "/:short_code",
  async ({ params, redirect }) => {
    const { short_code } = params;

    const result = await db.execute(
      `SELECT * FROM urls WHERE short_code = ?`,
      [short_code],
      { prepare: true },
    );

    const response = result?.rows[0];

    if (!response) {
      throw new NotFoundError();
    }

    return redirect(response.long_url, 301);
  },
);
