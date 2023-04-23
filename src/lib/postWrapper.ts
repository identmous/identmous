import { loadDefaultJapaneseParser } from "budoux";
import { escape } from "html-escaper";
import { fetchUser, type APIPost, type Post, type User } from "./client";
import * as stores from "./client/stores";

const parser = loadDefaultJapaneseParser();

export async function wrapPosts(posts: APIPost[]): Promise<Post[]> {
  let wrapped: Post[] = [];
  const userCache: User[] = [];
  for (let x of posts) {
    let y = x as Post;
    let parsed = parser.translateHTMLString(`<span>${escape(y.content)}</span>`);
    if (!parsed.match("<wbr>"))
      parsed = parsed.replace("<span>", `<span style="line-break: anywhere">`);
    y.content = parsed;
    y.user = userCache.find((z) => z.id === y.author_id) || (await fetchUser(y.author_id));
    userCache.push(y.user);
    stores.posts.update((z) => {
      z.set(y.id, y);
      return z;
    });
    stores.users.update((z) => {
      z.set(y.user.id, y.user);
      return z;
    });

    wrapped.push(y);
  }

  return wrapped;
}
