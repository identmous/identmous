PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  screen_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  password_hashed TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  reference_id TEXT,
  reference_type int,
  content TEXT,
  FOREIGN KEY (author_id) REFERENCES users (id)
);