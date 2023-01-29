import type { DBUser, User } from "$lib/client";
import { CODES } from "$lib/const";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ platform, request }) => {
  const req = await request.json<LoginRequest>();
  if (!req.username || !req.password || !req.turnstileToken)
    return new Response(
      JSON.stringify({ code: CODES.INVALID_LOGIN_INFO, message: "Missing params" }),
      { status: 400 }
    );
  const resTokenValidate = await validateToken(
    req.turnstileToken,
    platform.env.TURNSTILE_SECRET_KEY
  );
  if (!resTokenValidate.success)
    return new Response(
      JSON.stringify({ code: CODES.INVALID_CAPTCHA, message: "Turnstile token validate failed" })
    );
  console.log(platform.env)
  const user = await platform.env.DB.prepare("SELECT * FROM users WHERE screen_name = ?")
    .bind(req.username)
    .first<DBUser>();
  if (
    user &&
    btoaUrlSafe(await crypto.subtle.digest("SHA-512", new TextEncoder().encode(req.password))) ===
      user.password_hashed
  ) {
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

// from https://github.com/ghostdevv/svelte-turnstile#validate-captcha

interface TokenValidateResponse {
  "error-codes": string[];
  success: boolean;
  action: string;
  cdata: string;
}

async function validateToken(token: string, secret: string) {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      response: token,
      secret: secret
    })
  });

  const data: TokenValidateResponse = await response.json();

  return {
    // Return the status
    success: data.success,

    // Return the first error if it exists
    error: data["error-codes"]?.length ? data["error-codes"][0] : null
  };
}
