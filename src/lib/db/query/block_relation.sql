-- name: GetBlock :one
SELECT
  *
FROM
  block_relation
WHERE
  blocker_id = @blocker_id
  AND blocking_id = @blocking_id;

-- name: GetUserBlockers :many
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
  JOIN block_relation f ON u.id = f.blocker_id
WHERE
  f.blocker_id = @id
LIMIT
  50
OFFSET
  @offset;

-- name: GetUserBlocks :many
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
  JOIN block_relation f ON u.id = f.blocking_id
WHERE
  f.blocking_id = @id
LIMIT
  50
OFFSET
  @offset;

-- name: CreateBlock :exec
INSERT INTO
  block_relation (blocker_id, blocking_id)
VALUES
  (@blocker_id, @blocking_id);

-- name: DeleteBlock :exec
DELETE FROM block_relation
WHERE
  blocker_id = @blocker_id
  AND blocking_id = @blocking_id;
