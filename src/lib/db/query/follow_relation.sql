-- name: GetFollow :one
SELECT
  *
FROM
  follow_relation
WHERE
  follower_id = @follower_id
  AND following_id = @following_id;

-- name: GetUserFollowers :many
SELECT
  u.id,
  u.screen_name,
  u.display_name,
  u.bio,
  u.is_active,
  u.is_protected,
  u.avatar_url
FROM
  user u
  JOIN follow_relation f ON u.id = f.follower_id
WHERE
  f.follower_id = @id
LIMIT
  50
OFFSET
  @offset;

-- name: GetUserFollows :many
SELECT
  u.id,
  u.screen_name,
  u.display_name,
  u.bio,
  u.is_active,
  u.is_protected,
  u.avatar_url
FROM
  user u
  JOIN follow_relation f ON u.id = f.following_id
WHERE
  f.following_id = @id
LIMIT
  50
OFFSET
  @offset;

-- name: CreateFollow :exec
INSERT INTO
  follow_relation (follower_id, following_id)
VALUES
  (@follower_id, @following_id);

-- name: DeleteFollow :exec
DELETE FROM follow_relation
WHERE
  follower_id = @follower_id
  AND following_id = @following_id;
