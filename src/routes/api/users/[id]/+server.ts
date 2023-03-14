import type { DBUser } from "$lib/client";
import { CODES } from "$lib/const";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ platform, params, request }) => {
  if (
    (params.id === "@me" && request.headers.get("Authorization")?.split(".")?.at(0)) ||
    !isNaN(Number(params.id))
  ) {
    const result = await platform!.env.DB.prepare("SELECT * from users WHERE id = ?")
      .bind(
        params.id === "@me"
          ? atob(request.headers.get("Authorization")?.split(".")?.at(0)!)
          : params.id
      )
      .first<Partial<DBUser>>();
    delete result.password_hashed;
    return new Response(
      JSON.stringify(
        !!JSON.stringify(result)
          ? { code: CODES.SUCCESS, ...result }
          : { code: CODES.NOT_FOUND, message: `Could not find user with id "${params.id}".` }
      ),
      {
        headers: { "Content-type": "application/json" }
      }
    );
  } else {
    return new Response(
      JSON.stringify({
        code: CODES.INVALID_ID,
        message: "Id is invalid."
      })
    );
  }
};
