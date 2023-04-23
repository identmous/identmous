import { writable, type Writable } from "svelte/store";
import type { CODES } from "./const";

export class Client {
  protected constructor() {}
}

export async function fetchMe(): Promise<User | null> {
  return await fetchUser("@me");
}

export async function fetchUser(id: string): Promise<User> {
  const token = localStorage.getItem("token");
  if (token) {
    return await (await fetch("/api/users/" + id, { headers: { Authorization: token } })).json();
  } else {
    throw new Error("Not logged in");
  }
}

export async function login(
  username: string,
  password: string,
  turnstileToken: string
): Promise<LoginResponse> {
  return await (
    await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        turnstileToken
      })
    })
  ).json();
}

export async function fetchPosts(id: string): Promise<PostsResponse> {
  return await (await fetch("/api/posts/" + id)).json<PostsResponse>();
}

export async function fetchTimeline(): Promise<APIPost[]> {
  const token = localStorage.getItem("token");
  if (token) {
    return await (await fetch("/api/timeline", { headers: { Authorization: token } })).json();
  } else {
    throw new Error("Not logged in");
  }
}

export async function fetchFollow(id: string): Promise<{result?: User}> {
  const token = localStorage.getItem("token");
  if (token) {
    return await (
      await fetch("/api/users/" + id + "/follow", { headers: { Authorization: token } })
    ).json();
  } else {
    throw new Error("Not logged in");
  }
}

export async function follow(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  if (token) {
    await fetch("/api/users/" + id + "/follow", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: token
      },
    });
  } else {
    throw new Error("Not logged in");
  }
}

export async function unfollow(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  if (token) {
    await fetch("/api/users/" + id + "/follow", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: token
      },
    });
  } else {
    throw new Error("Not logged in");
  }
}

export interface User {
  id: string;
  display_name: string;
  screen_name: string;
  bio?: string;
  avatar_url: string;
}

export interface DBUser extends User {
  password_hashed: string;
}

export type LoginResponse = LoginFailedResponse | LoginSuccessResponse;

interface LoginFailedResponse {
  code: typeof CODES.INVALID_LOGIN_INFO | typeof CODES.INVALID_ACCOUNT;
  message: string;
}

interface LoginSuccessResponse {
  code: typeof CODES.SUCCESS;
  token: string;
}

export interface APIPost {
  id: string;
  author_id: string;
  reference_id?: string;
  content: string;
}

export interface Post extends APIPost {
  user: User;
}

export interface PostsResponse {
  code: typeof CODES;
  results: APIPost[];
}
