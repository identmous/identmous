// See https://kit.svelte.dev/docs/types#app

import type { CODES } from "$lib/consts";
import type { KVNamespace } from "@cloudflare/workers-types/experimental";

// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      code: CODES;
      data: Object;
    }
    // interface Locals {}
    // interface PageData {}
    interface Platform {
      env: Env;
    }

    interface Env {
      TURNSTILE_SECRET_KEY: string;
      TURNSTILE_SITE_KEY: string;
      D1: D1Database;
      MEILISEARCH_ENDPOINT: string;
      MEILISEARCH_APIKEY: string;
      KV: KVNamespace;
    }
  }
}

export {};
