-- name: GetTimeline :many
SELECT
  p.*
FROM
  post p
  INNER JOIN user u ON p.author_id = u.id
  LEFT JOIN block_relation b ON u.id = b.blocking_id
  LEFT JOIN follow_relation f ON u.id = f.following_id
WHERE
  f.follower_id = @user_id
  AND (
    b.blocker_id IS NULL
    OR b.blocker_id != @user_id
  )
ORDER BY
  p.id DESC
LIMIT
  50;
