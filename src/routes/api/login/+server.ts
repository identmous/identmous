import type { DBUser, User } from "$lib/client";
import { CODES } from "$lib/const";
import { validateTurnstileToken } from "$lib/server/validate";
import type { RequestHandler } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
const { compareSync } = bcrypt;

export const POST: RequestHandler = async ({ platform, request }) => {
  const req = await request.json<LoginRequest>();
  if (!req.username || !req.password || !req.turnstileToken)
    return new Response(
      JSON.stringify({ code: CODES.INVALID_LOGIN_INFO, message: "Missing params" }),
      { status: 400 }
    );
  const resTokenValidate = await validateTurnstileToken(
    req.turnstileToken,
    platform!.env.TURNSTILE_SECRET_KEY
  );
  if (!resTokenValidate.success)
    return new Response(
      JSON.stringify({ code: CODES.INVALID_CAPTCHA, message: "Turnstile token validate failed" }),
      { status: 401 }
    );
  const user = await platform!.env.DB.prepare("SELECT * FROM users WHERE screen_name = ?")
    .bind(req.username)
    .first<DBUser>();
  if (user && compareSync(req.password, user.password_hashed)) {
    const token = [user.id, user.password_hashed]
      .map((x) => btoa(x).replaceAll("/", "_").replaceAll("+", "").replaceAll("=", ""))
      .join(".");
    const resUser: { token: string } & User & Partial<DBUser> = { token, ...user };
    delete resUser.password_hashed;
    return new Response(JSON.stringify({ code: 0, ...resUser }), {
      headers: {
        "Content-type": "application/json"
      }
    });
  }
  return new Response(
    JSON.stringify({ code: CODES.INVALID_LOGIN_INFO, message: "Password or username is invalid" }),
    { status: 401 }
  );
};

interface LoginRequest {
  username: string;
  password: string;
  turnstileToken: string;
}

function btoaUrlSafe(buf: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replaceAll("/", "_").replaceAll("+", "-").replaceAll("=", "");
}
