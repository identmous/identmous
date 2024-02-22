CREATE TABLE IF NOT EXISTS
  user(
    id TEXT PRIMARY KEY,
    screen_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    password_hashed TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_protected BOOLEAN NOT NULL DEFAULT 0,
    bio TEXT,
    avatar_url TEXT NOT NULL DEFAULT "https://r2.identmous.com/favicon.jpg"
  );

CREATE TABLE IF NOT EXISTS
  post (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    reference_id TEXT,
    content TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user(id)
  );

CREATE TABLE IF NOT EXISTS
  follow_relation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id TEXT NOT NULL, -- フォロワーのID
    following_id TEXT NOT NULL, -- フォローする相手のID
    FOREIGN KEY (follower_id) REFERENCES user(id),
    FOREIGN KEY (following_id) REFERENCES user(id),
    UNIQUE (follower_id, following_id)
  );

CREATE TABLE IF NOT EXISTS
  block_relation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blocker_id TEXT NOT NULL,
    blocking_id TEXT NOT NULL,
    FOREIGN KEY (blocker_id) REFERENCES user(id),
    FOREIGN KEY (blocking_id) REFERENCES user(id),
    UNIQUE (blocker_id, blocker_id)
  );