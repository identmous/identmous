import { CODES } from "$lib/const";
import { validateToken } from "$lib/server/validate";
import type { RequestHandler } from "@sveltejs/kit";
import type { Post, User } from "$lib/client";
const query = `SELECT posts.*
FROM posts
JOIN follow_relation
ON posts.author_id = follow_relation.follower_id
WHERE follow_relation.following_id = ? OR posts.author_id = ?
ORDER BY cast(posts.id as INTEGER) DESC
LIMIT 50;`;

export const GET: RequestHandler = async ({ platform, request }) => {
  const user = await validateToken(request, platform!.env.DB).catch((x: Response) => x);
  if (user instanceof Response) return user;
  const result = await platform!.env.DB.prepare(query).bind(user.id, user.id).all<Post[]>();

  if (!result.success)
    return new Response(
      JSON.stringify({
        code: CODES.INTERNAL_ERROR,
        error: result.error,
        message: "😭 An internal server error occurred. Please contact developer."
      }),
      { status: 500 }
    );
  return new Response(JSON.stringify(result.results));
};
