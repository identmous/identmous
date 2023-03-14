import { writable, type Writable } from "svelte/store";
import type { CODES } from "./const";

export const users: Writable<User[]> = writable([]);

export async function fetchMe(): Promise<User | null> {
  return await fetchUser("@me");
}

export async function fetchUser(id: string): Promise<User | null> {
  const token = localStorage.getItem("token");
  if (token) {
    return await (await fetch("/api/users/" + id, { headers: { Authorization: token } })).json();
  } else {
    return null;
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

export async function fetchTimeline(): Promise<Post[] | null> {
  const token = localStorage.getItem("token");
  if (token) {
    return await (await fetch("/api/timeline", { headers: { Authorization: token } })).json();
  } else {
    return null;
  }
}

export interface User {
  id: string;
  display_name: string;
  screen_name: string;
  bio?: string;
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

export interface Post {
  id: string;
  author_id: string;
  reference_id?: string;
  content: string;
}

export interface PostsResponse {
  code: typeof CODES;
  results: Post[];
}
