import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ platform, request, params }) => {
  return new Response();
};
