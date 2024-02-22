import type { Writable } from "svelte/store";
import type { Collection } from "@discordjs/collection";
import UserManager from "./managers/UserManager";
import Rest from "./Rest";
import { defaultRoute } from "./route";
import bind from "$lib/decorators/bind";

export default class Client {
  rest: Rest;
  users: UserManager;
  #token: string;

  constructor(token: string) {
    this.#token = token;
    this.rest = new Rest(token);
    this.users = new UserManager(this.rest);
  }

  @bind
  async login(screenName: string, password: string, turnstileToken: string) {
    const res = (await this.rest.post(defaultRoute.build(defaultRoute.login), {
      screenName,
      password,
      turnstileToken,
    })) as { token: string };

    this.#token = res.token;
    this.rest.setToken(this.#token);

    return this.#token;
  }
}

export type Cache<T> = Writable<Collection<string, T>>;
