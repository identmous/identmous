import { CODES } from "$lib/const";
import { validateToken } from "$lib/server/validate";
import type { RequestHandler } from "@sveltejs/kit";
import type { Post, User } from "$lib/client";
const query = `SELECT *
FROM posts
WHERE author_id = ?
UNION
SELECT posts.*
FROM posts
INNER JOIN follow_relation
ON posts.author_id = follow_relation.following_id
WHERE follow_relation.follower_id = ?
ORDER BY id DESC
LIMIT 50 OFFSET ?;`;

export const GET: RequestHandler = async ({ platform, request, url }) => {
  const params = new URLSearchParams(url.search);
  let offset = 0;
  let _offset = params.get("offset");
  console.log(offset, _offset);
  if (_offset && !isNaN(+_offset)) {
    offset = +_offset * 50;
  }
  console.log(offset, _offset);
  const user = await validateToken(request, platform!.env.DB).catch((x: Response) => x);
  if (user instanceof Response) return user;
  const result = await platform!.env.DB.prepare(query).bind(user.id, user.id, offset).all<Post[]>();

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
