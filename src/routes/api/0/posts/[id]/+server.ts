import { CODES } from "$lib/consts";
import { getBlock, getPost, getUser } from "$lib/db/querier";
import { validateToken } from "$lib/server/account/validateToken";
import respond, { fail } from "$lib/server/respond";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ platform, request, params }) => {
  const user = await validateToken(request, platform!.env.D1);
  const target = await getPost(platform!.env.D1, {
    id: params.id,
  });

  if (!target) return fail(404, "Not found", CODES.NOT_FOUND);

  const targetUser = await getUser(platform!.env.D1, {
    id: target.authorId,
  });

  if (!targetUser)
    return fail(
      404,
      "The author of that submission does not exist. It is most likely a bug",
      CODES.NOT_FOUND,
    );

  if (!targetUser.isActive)
    return fail(403, "The author has been suppresed", CODES.SUPPRESED);

  const blocked = await getBlock(platform!.env.D1, {
    blockerId: targetUser.id,
    blockingId: user.id,
  });

  if (blocked)
    return fail(403, "You have been blocked by this user", CODES.BAD_REQUEST);

  return respond(CODES.SUCCESS, 200, { target });
};
