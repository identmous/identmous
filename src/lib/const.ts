import { Snowflake } from "@sapphire/snowflake";

export const CODES = {
  SUCCESS: 0,
  INVALID_ID: 1,
  NOT_FOUND: 2,
  INVALID_LOGIN_INFO: 3,
  INVALID_ACCOUNT: 4,
  INVALID_CAPTCHA: 5,
  INVALID_CONTENT_LENGTH: 6,
  INTERNAL_ERROR: 7,
  BAD_REQUEST: 8,
  ALREADY_EXISTS: 9
} as const;

export const SNOWFLAKE = new Snowflake(new Date("2022-11-20T00:00:00.000Z"));
