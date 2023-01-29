declare namespace App {
  interface Platform {
    env: {
      __D1_BETA__DB: D1Database;
      TURNSTILE_SECRET_KEY: string;
      TURNSTILE_SITE_KEY: string;
    };
  }
}
