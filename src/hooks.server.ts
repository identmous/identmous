import type { Handle } from "@sveltejs/kit";

const headers = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block"
};

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
  return response;
};
