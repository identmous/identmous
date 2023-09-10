import { CODES } from "$lib/consts";
import { getBlock, getUser, getUserByScreenName } from "$lib/db/querier";
import respond, { fail } from "$lib/server/respond";
import { validateToken } from "$lib/server/account/validateToken";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, request, platform }) => {
  const user = await validateToken(request, platform!.env);
  const target =
    params.screenname === "@me"
      ? user
      : await getUserByScreenName(platform!.env.D1, {
          screenName: params.screenname,
        });

  if (!target) return fail(404, "Not found", CODES.NOT_FOUND);

  const blocked = await getBlock(platform!.env.D1, {
    blockerId: target.id,
    blockingId: user.id,
  });

  if (blocked)
    return fail(403, "You have been blocked by this user", CODES.BAD_REQUEST);

  return respond(CODES.SUCCESS, 200, target);
};
