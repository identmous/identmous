import type { CODES } from "$lib/consts";

export const endpoint = "/api";

export const routes = {
  0: {
    login: "/auth/login",
    user: "/users/{0}",
  },
};

export const defaultRoute = { build: _(0), ...routes[0] };

function _(version: number) {
  return function buildRoute(route: string, ...args: string[]) {
    return (
      endpoint +
      "/" +
      version +
      args.reduce(
        (a, c, i) => a.replace(new RegExp(`\\{${i}\\}`, "g"), c),
        route,
      )
    );
  };
}
