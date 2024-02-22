import type { Post } from "$lib/db/models";
import { MeiliSearch } from "meilisearch";

let meilisearch: MeiliSearch;

export function getSearch(env: App.Env) {
  if (!meilisearch)
    meilisearch = new MeiliSearch({
      host: env.MEILISEARCH_ENDPOINT,
      apiKey: env.MEILISEARCH_APIKEY,
    });

  return meilisearch;
}

export function posts(env: App.Env) {
  return getSearch(env).index<Post>("posts");
}
