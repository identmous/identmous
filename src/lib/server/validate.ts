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
