import type { Post } from "$lib/client";
import { CODES, SNOWFLAKE } from "$lib/const";
import { validateToken } from "$lib/server/validate";
import type { RequestHandler } from "./$types";

// todo: validate referenece post
export const POST: RequestHandler = async ({ platform, request }) => {
  const user = await validateToken(request, platform!.env.DB).catch((x: Response) => x);
  // not DBUser.
  // todo: rename this
  if (user instanceof Response) return user;
  const post = await request.json<Omit<Post, "id">>();
  if (post.content.length === 0 || post.content.length > 140)
    return new Response(JSON.stringify({ code: CODES.INVALID_CONTENT_LENGTH }), { status: 400 });
  const postId = SNOWFLAKE.generate();
  let query;
  if (post.reference_id) {
    query = platform.env.DB.prepare(
      "INSERT INTO posts (id, author_id, content, reference_id) VALUES (?, ?, ?, ?)"
    ).bind(postId.toString(), user.id, post.content, post.reference_id);
  } else {
    query = platform.env.DB.prepare(
      "INSERT INTO posts (id, author_id, content) VALUES (?, ?, ?)"
    ).bind(postId.toString(), user.id, post.content);
  }
  const insertResult = await query.run();
  if (insertResult.error)
    return new Response(
      JSON.stringify({
        code: CODES.INTERNAL_ERROR,
        error: insertResult.error,
        message: "😭 An internal server error occurred. Please contact developer."
      }),
      { status: 500 }
    );
  return new Response(
    JSON.stringify({
      code: CODES.SUCCESS,
      id: postId.toString(),
      reference_id: post.reference_id,
      content: post.content,
      author_id: user.id
    })
  );
};
