import { CODES } from "./consts";
import respond from "./server/respond";

export abstract class HttpError extends Error {
  abstract toResponse(): Response;
}

export class UnauthorizedError extends HttpError {
  code: CODES;

  constructor(code: CODES, message?: string) {
    super(message);
    this.code = code;
    this.name = "UnauthorizedError";
  }

  toResponse(): Response {
    return respond(this.code, 401, { error: this.name });
  }
}

export class InvalidFormBodyError extends HttpError {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidFormBodyError";
  }

  toResponse(): Response {
    return respond(CODES.BAD_REQUEST, 400, {
      error: `[${this.name}] ${this.message}`,
    });
  }
}
