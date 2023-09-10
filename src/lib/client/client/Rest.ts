import bind from "$lib/decorators/bind";

export default class Rest {
  #token: string;

  constructor(token: string) {
    this.#token = token;
  }

  @bind
  setToken(token: string) {
    this.#token = token;
  }

  @bind
  async get(route: string) {
    return check(await this.fetch(route, {}));
  }

  @bind
  async post(route: string, payload?: any) {
    return check(
      await this.fetch(route, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );
  }

  @bind
  async fetch(route: string, overrides: Object) {
    const res = await fetch(route, {
      headers: {
        Authorization: this.#token,
      },
      ...overrides,
    });

    return {
      status: res.status,
      ok: res.ok,
      data: await res.json(),
    };
  }
}

function check(res: { status: number; ok: boolean; data: any }) {
  if (!res.ok) throw new Error("[REST] " + res.data.error);

  return res.data;
}
