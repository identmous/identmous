declare namespace App {
  interface Platform {
    env: {
      DB: D1Database;
      TURNSTILE_SECRET_KEY: string;
      TURNSTILE_SITE_KEY: string;
      R2: R2Bucket
    };
  }
}
