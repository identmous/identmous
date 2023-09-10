import { CODES } from "$lib/consts";
import respond, { fail } from "$lib/server/respond";
import validateTurnstileToken from "$lib/server/account/validateTurnstileToken";
import type { RequestHandler } from "./$types";
import { $object, $string, type Infer } from "lizod";
import bcrypt from "bcryptjs";
import { getUserByScreenName, getUserUnsafe } from "$lib/db/querier";
import { SignJWT, importPKCS8 } from "jose";
import { getPrivateKey } from "$lib/server/keys";

const { compareSync } = bcrypt;
const validate = $object({
  password: $string,
  screenName: $string,
  turnstileToken: $string,
});

export const POST: RequestHandler = async ({ platform, request }) => {
  const data: Infer<typeof validate> = await request.json();

  if (!validate(data))
    return fail(400, "Invalid request body", CODES.BAD_REQUEST);

  if (
    !(
      await validateTurnstileToken(
        data.turnstileToken,
        platform?.env.TURNSTILE_SECRET_KEY!,
      )
    ).success
  )
    return fail(400, "Captcha result is invalid", CODES.INVALID_CAPTCHA);

  const user = await getUserByScreenName(platform?.env.D1!, {
    screenName: data.screenName,
  });

  if (!user) return fail(404, "Not found", CODES.NOT_FOUND);

  if (!user.isActive)
    return fail(400, "Your account is suppresed", CODES.SUPPRESED);

  const { passwordHashed } = (await getUserUnsafe(platform?.env.D1!, {
    id: user.id,
  }))!;

  if (!compareSync(data.password, passwordHashed))
    return fail(401, "Password does not match", CODES.INVALID_LOGIN_INFO);

  const secret = await importPKCS8(await getPrivateKey(platform!.env), "ES256");

  const token = await new SignJWT({ "urn:example:claim": true })
    .setProtectedHeader({ alg: "ES256" })
    .setIssuedAt()
    .setAudience("urn:identmous:user:" + user.id)
    .setIssuer("urn:identmous:user:system")
    .sign(secret);

  return respond(CODES.SUCCESS, 200, {
    token,
  });
};
