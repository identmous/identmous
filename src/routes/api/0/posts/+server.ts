import { validateToken } from "$lib/server/account/validateToken";
import { $opt, $object, $string, access, type Infer } from "lizod";
import type { RequestHandler } from "./$types";
import {
  createPost,
  getBlock,
  getFollow,
  getPost,
  getTimeline,
  getUser,
} from "$lib/db/querier";
import { InvalidFormBodyError } from "$lib/errors";
import { CODES, SNOWFLAKE } from "$lib/consts";
import type { ValidatorContext } from "$lib";
import respond, { fail } from "$lib/server/respond";
import { posts } from "$lib/server/search";

const validate = $object({
  content: $string,
  referenceId: $opt($string),
});

export const GET: RequestHandler = async ({ request, platform }) => {
  const user = await validateToken(request, platform!.env);

  if (!user.isActive)
    return fail(403, "Your account has been suppressed", CODES.SUPPRESED);

  const timeline = await getTimeline(platform!.env.D1, { userId: user.id });

  return respond(CODES.SUCCESS, 200, { timeline });
};

export const POST: RequestHandler = async ({ request, platform }) => {
  const user = await validateToken(request, platform!.env);
  const data: Infer<typeof validate> = await request.json();
  const ctx: ValidatorContext = { errors: [] };
  const id = SNOWFLAKE.generate();

  if (!validate(data, ctx))
    return new InvalidFormBodyError(
      ctx.errors
        .map(
          (x) =>
            `Invalid "${x.join(".")}" (${JSON.stringify(access(data, x))})`,
        )
        .join("\n"),
    ).toResponse();

  if (data.referenceId) {
    const parent = await getPost(platform!.env.D1, { id: data.referenceId });

    if (!parent)
      return fail(404, "The reference post does not exist", CODES.NOT_FOUND);

    const parentAuthor = (await getUser(platform!.env.D1, {
      id: parent.authorId,
    }))!;

    if (!parentAuthor.isActive)
      return fail(
        400,
        "The author of the referenced post has been suppressed",
        CODES.SUPPRESED,
      );

    const blocked = await getBlock(platform!.env.D1, {
      blockerId: parentAuthor.id,
      blockingId: user.id,
    });

    if (blocked)
      return fail(
        403,
        "You have been blocked by referring post author",
        CODES.BAD_REQUEST,
      );

    if (parentAuthor.isProtected) {
      const follow = await getFollow(platform!.env.D1, {
        followerId: user.id,
        followingId: parentAuthor.id,
      });

      if (!follow) return fail(404, "Not found", CODES.NOT_FOUND);
    }
  }

  const post = {
    authorId: user.id,
    content: data.content,
    id: id.toString(),
    referenceId: data.referenceId || null,
  };

  await createPost(platform!.env.D1, post);

  const index = posts(platform!.env);

  await index.addDocuments([post]);

  return respond(CODES.SUCCESS, 200, { id: id.toString() });
};
