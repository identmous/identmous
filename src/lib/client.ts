export async function login(): Promise<User | null> {
  const token = localStorage.getItem("token");
  if (token) {
    return await (await fetch("/api/users/@me", { headers: { Authorization: token } })).json();
  } else {
    return null;
  }
}

export interface User {
  id: string;
  display_name: string;
  screen_name: string;
  bio?: string
}
