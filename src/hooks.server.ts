import { CODES } from "$lib/consts";
import { HttpError } from "$lib/errors";
import type { HandleServerError } from "@sveltejs/kit";

export const handleError: HandleServerError = async ({ error }) => {
  if (error instanceof HttpError) {
    const response = (await error.toResponse().json()) as App.Error;

    return response;
  }

  console.error(error);

  return {
    code: CODES.INTERNAL_ERROR,
    message: "Internal Error",
    data: {
      error: "Internal Error",
    },
  };
};
