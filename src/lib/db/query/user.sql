-- name: GetUserUnsafe :one
SELECT
  *
FROM
  user
WHERE
  id = @id;

-- name: GetUser :one
SELECT
  user.id,
  user.screen_name,
  user.display_name,
  user.bio,
  user.is_active,
  user.is_protected,
  user.avatar_url
FROM
  user
WHERE
  id = @id;

-- name: GetUserByScreenName :one
SELECT
  user.id,
  user.screen_name,
  user.display_name,
  user.bio,
  user.is_active,
  user.is_protected,
  user.avatar_url
FROM
  user
WHERE
  screen_name = @screen_name;

-- name: CreateUser :exec
INSERT INTO
  user(id, screen_name, display_name, password_hashed)
VALUES
  (
    @id,
    @screen_name,
    @display_name,
    @password_hashed
  );

-- name: SetSuppressUser :exec
UPDATE user
SET
  is_active = @active
WHERE
  id = @id;

-- name: SetProtectUser :exec
UPDATE user
SET
  is_protected = @protected
WHERE
  id = @id;

-- name: EditBioUser :exec
UPDATE user
SET
  bio = @bio
WHERE
  id = @id;
