-- name: GetPost :one
SELECT
  *
FROM
  post
WHERE
  id = @id;

-- name: GetPostsByAuthorId :many
SELECT
  *
FROM
  post
WHERE
  author_id = @author_id;

-- name: GetPostsByReferenceId :many
SELECT
  *
FROM
  post
WHERE
  reference_id = @id;

-- name: GetPostsByFollows :many
SELECT
  p.id,
  p.author_id,
  p.reference_id,
  p.content
FROM
  post p
  JOIN follow_relation f ON p.author_id = f.following_id
WHERE
  f.follower_id = @id
ORDER BY
  p.id DESC
LIMIT
  50;

-- name: CreatePost :exec
INSERT INTO
  post (id, author_id, reference_id, content)
VALUES
  (@id, @author_id, @reference_id, @content);

-- name: DeletePost :exec
DELETE FROM post
WHERE
  id = @id;
