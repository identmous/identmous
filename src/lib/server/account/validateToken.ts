import { CODES } from "$lib/consts";
import { getUser } from "$lib/db/querier";
import { decodeJwt, jwtVerify, importSPKI } from "jose";
import { UnauthorizedError } from "$lib/errors";
import { getPublicKey } from "../keys";

export async function validateToken(request: Request, env: App.Env) {
  const token = request.headers.get("Authorization");
  const parsed = (() => {
    try {
      return decodeJwt(token!);
    } catch {}
  })();

  if (!parsed) throw new UnauthorizedError(CODES.INVALID_LOGIN_INFO);

  const user = await getUser(env.D1, {
    id: (parsed.aud as string | null)?.split(":").at(-1) || "",
  });

  if (!user) throw new UnauthorizedError(CODES.INVALID_ACCOUNT);

  const key = await importSPKI(await getPublicKey(env), "ES256");
  const verifyResult = await jwtVerify(token!, key).catch(console.error);

  if (!verifyResult) throw new UnauthorizedError(CODES.INVALID_LOGIN_INFO);

  return user;
}
