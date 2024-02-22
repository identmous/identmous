import type { User } from "$lib/db/models";
import { get, writable } from "svelte/store";
import type { Cache } from "..";
import { Collection } from "@discordjs/collection";
import type Rest from "../Rest";
import DataManager from "./DataManager";
import { defaultRoute } from "../route";
import bind from "$lib/decorators/bind";

export default class UserManager extends DataManager {
  cache: Cache<User>;

  constructor(rest: Rest) {
    super(rest);

    this.cache = writable(new Collection());
  }

  @bind
  async fetch(id: string) {
    const cache = get(this.cache);
    const user =
      cache.get(id) ??
      ((await this.rest.get(
        defaultRoute.build(defaultRoute.user, id),
      )) as User);

    cache.set(id, user);

    this.cache.set(cache);

    return user;
  }
}
