const supported = ["en", "ja"];
let current: Record<string, string>;

export function kv(source: string): Record<string, string> {
  return source
    .split("\n")
    .map((x) => {
      const pair = x.split("=");
      return {
        [pair[0] || Symbol("invalid key")]: pair[1] || ""
      };
    })
    .reduce((a, c) => Object.assign(a, c), {});
}

export async function init() {
  const lang: typeof supported[number] = supported.includes(navigator.language)
    ? navigator.language
    : "en";
  current = kv(await (await fetch("/locales/" + lang + ".properties")).text());

  return current;
}

export function get() {
  return current;
}

export function format(...r: string[]): string {
  return r.reduce((a, c, i) => a?.replace(new RegExp(`\\{${i}\\}`, "g"), c), r.shift()) as string;
}
