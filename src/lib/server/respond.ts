import { CODES } from "$lib/consts";

export default function respond(
  code: CODES,
  status: number = 200,
  body?: Object,
) {
  return new Response(JSON.stringify({ code, data: body ?? {} }), { status });
}

export function fail(status: number, reason: string, code: CODES) {
  return respond(code, status, {
    reason,
  });
}

export function internalError(error: string, message?: string) {
  return respond(CODES.INTERNAL_ERROR, 500, {
    message: message ?? "😭 An internal server error occurred.",
    error,
  });
}
