import type { Post } from "$lib/client";
import { CODES } from "$lib/const";
import { Snowflake } from "@sapphire/snowflake";
import type { RequestHandler } from "@sveltejs/kit";

const snowflake = new Snowflake(new Date("2022-11-20T00:00:00.00Z"));

export const GET: RequestHandler = async ({ platform, params }) => {
  const posts = await platform.env.DB.prepare("SELECT * FROM posts WHERE author_id = ?")
    .bind(params.id)
    .all<Post>();
  if (posts.results) {
    posts.results = posts.results.sort((a, b) =>
      Number(snowflake.decode(b.id).timestamp - snowflake.decode(a.id).timestamp)
    );
  }
  return new Response(JSON.stringify({ code: CODES.SUCCESS, results: posts.results || [] }));
};
