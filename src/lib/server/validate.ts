import type { DBUser } from "$lib/client";
import { CODES } from "$lib/const";

export async function validateToken(request: Request, db: D1Database): Promise<DBUser> {
  const token = request.headers.get("Authorization");
  if (!token || token.split(".").length !== 2)
    throw new Response(JSON.stringify({ code: CODES.INVALID_LOGIN_INFO }), { status: 401 });
  const user = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(atob(token.split(".")[0]))
    .first<DBUser>();
  if (!user) throw new Response(JSON.stringify({ code: CODES.NOT_FOUND }), { status: 401 });
  if (user.password_hashed !== atob(token.split(".")[1]))
    throw new Response(JSON.stringify({ code: CODES.INVALID_LOGIN_INFO }), { status: 401 });
  return user;
}

// from https://github.com/ghostdevv/svelte-turnstile#validate-captcha

export interface TurnstileTokenValidateResponse {
  "error-codes": string[];
  success: boolean;
  action: string;
  cdata: string;
}

export async function validateTurnstileToken(token: string, secret: string) {
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

  const data: TurnstileTokenValidateResponse = await response.json();

  return {
    // Return the status
    success: data.success,

    // Return the first error if it exists
    error: data["error-codes"]?.length ? data["error-codes"][0] : null
  };
}

