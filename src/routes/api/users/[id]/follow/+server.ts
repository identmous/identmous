import { CODES } from "$lib/const";
import { validateToken } from "$lib/server/validate";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ platform, request, params }) => {
  const user = await validateToken(request, platform!.env.DB).catch((x: Response) => x);
  if (user instanceof Response) return user;
  if (params.id === undefined)
    return new Response(
      JSON.stringify({ code: CODES.INVALID_ID, message: "Missing required field: `id`" }),
      { status: 400 }
    );
  const result = await platform!.env.DB.prepare(
    "INSERT INTO follow_relation (follower_id, following_id) VALUES (?, ?)"
  )
    .bind(user.id, params.id)
    .run();

  if (!result.success)
    return new Response(
      JSON.stringify({
        code: CODES.INTERNAL_ERROR,
        error: result.error,
        message: "😭 An internal server error occurred. Please contact developer."
      }),
      { status: 500 }
    );

  return new Response(JSON.stringify({ code: CODES.SUCCESS }));
};

export const DELETE: RequestHandler = async ({ platform, request, params }) => {
  const user = await validateToken(request, platform!.env.DB).catch((x: Response) => x);
  if (user instanceof Response) return user;
  if (params.id === undefined)
    return new Response(
      JSON.stringify({ code: CODES.INVALID_ID, message: "Missing required field: `id`" }),
      { status: 400 }
    );
  const result = await platform!.env.DB.prepare(
    "DELETE FROM follow_relation WHERE follower_id = ? AND following_id = ?"
  )
    .bind(user.id, params.id)
    .run();

  if (!result.success)
    return new Response(
      JSON.stringify({
        code: CODES.INTERNAL_ERROR,
        error: result.error,
        message: "😭 An internal server error occurred. Please contact developer."
      }),
      { status: 500 }
    );

  return new Response(JSON.stringify({ code: CODES.SUCCESS }));
};

export const GET: RequestHandler = async ({ platform, request, params }) => {
  const user = await validateToken(request, platform!.env.DB).catch((x: Response) => x);
  if (user instanceof Response) return user;
  const result = await platform!.env.DB.prepare(
    "SELECT * FROM follow_relation WHERE follower_id = ? AND following_id = ?"
  )
    .bind(user.id, params.id)
    .first();

  return new Response(JSON.stringify({ code: CODES.SUCCESS, result }));
};
