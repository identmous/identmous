import type { Post, User } from "$lib/client";
import { writable } from "svelte/store";
import { Collection } from "@discordjs/collection";

export const users = writable<Collection<string, User>>(new Collection());
export const posts = writable<Collection<string, Post>>(new Collection());
