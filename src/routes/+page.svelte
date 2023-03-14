<script lang="ts">
  import { fetchTimeline, fetchUser, type Post, type User } from "$lib/client";
  import { SNOWFLAKE } from "$lib/const";
  import { get } from "$lib/locale";
  import { onMount } from "svelte";
  import { Divider, H1 } from "../../attractions/attractions";

  const locale = get();
  let posts: Post[] = [];
  let users: User[] = [];

  onMount(async () => {
    await fetchTimeline()
      .then(async (x) => {
        if (!x) console.error("[fetchTimeline] null");
        for (let y of x!) {
          if (users.find(z => z.id === y.author_id)) continue;
          const user = await fetchUser(y.author_id).catch(console.error);
          if (!user) return;
          users = [...users, user];
        };
        posts = x!;
      })
      .catch(console.error);
  });
</script>

<main>
  {#each posts as post}
    {@const user = users.find((x) => x.id === post.author_id)}
    <p>
      {user?.display_name || ""} <span class="hid">@{user?.screen_name}</span>
      <span class="hid"
        >{Intl.DateTimeFormat([], { dateStyle: "long" }).format(
          new Date(Number(SNOWFLAKE.decode(post?.id || "").timestamp))
        )}</span>
    </p>
    <p>{post.content}</p>
    <Divider />
  {/each}
</main>
