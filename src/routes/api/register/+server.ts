import type { RequestHandler } from "./$types";
import { CODES, SNOWFLAKE } from "$lib/const";
import { validateTurnstileToken } from "$lib/server/validate";
import bcrypt from "bcryptjs";
const { hashSync } = bcrypt;

export const POST: RequestHandler = async ({ request, platform }) => {
  const payload = await request.json<RegisterRequest>();
  console.log(payload);
  if (!payload.displayName.length || !payload.screenName.length || payload.password.length > 8)
    return new Response(JSON.stringify({ code: CODES.INVALID_CONTENT_LENGTH }), { status: 400 });
  if (!validateTurnstileToken(payload.turnstileToken, platform!.env.TURNSTILE_SECRET_KEY))
    return new Response(JSON.stringify({ code: CODES.INVALID_CAPTCHA }), { status: 400 });
  const isUserExists = !!(await platform!.env.DB.prepare(
    "SELECT screen_name FROM users WHERE screen_name = ?"
  )
    .bind(payload.screenName)
    .first<{ screen_name?: string }>());
  if (isUserExists)
    return new Response(JSON.stringify({ code: CODES.ALREADY_EXISTS }), { status: 400 });
  const userId = SNOWFLAKE.generate();
  await platform!.env.DB.prepare(
    "INSERT INTO users (id, display_name, screen_name, password_hashed) VALUES (?, ?, ?, ?)"
  )
    .bind(userId.toString(), payload.displayName, payload.screenName, hashSync(payload.password))
    .run();
  return new Response(JSON.stringify({ id: userId, code: CODES.SUCCESS }));
};

interface RegisterRequest {
  displayName: string;
  screenName: string;
  password: string;
  turnstileToken: string;
}
