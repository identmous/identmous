import { createSQLiteDB } from "@miniflare/shared";
import { D1Database, D1DatabaseAPI } from "@miniflare/d1";

const sqliteDB = await createSQLiteDB(".wrangler/state/v3/d1/D1/db.sqlite");
const db = new D1Database(new D1DatabaseAPI(sqliteDB));

const [, , ...args] = process.argv;

console.log(
  await db
    .prepare(
      "INSERT INTO user (id, screen_name, display_name, password_hashed) VALUES (?, ?, ?, ?)",
    )
    .bind(...args)
    .run(),
);
