<script lang="ts">
  import { fetchTimeline, fetchUser, type Post, type User } from "$lib/client";
  import { get } from "$lib/locale";
  import { wrapPosts } from "$lib/postWrapper";
  import Posts from "$lib/components/Posts.svelte";

  const locale = get();

  //  onMount(async () => {
  //    await fetchTimeline()
  //      .then(async (x) => {
  //        if (!x) console.error("[fetchTimeline] null");
  //        for (let y of x!) {
  //          if ($users.find((z) => z.id === y.author_id)) continue;
  //          const user = await fetchUser(y.author_id).catch(console.error);
  //          if (!user) return;
  //          $users.set(user.id, user);
  //        }
  //        wrapPosts(x!).forEach((z) => $posts.set(z.id, z));
  //      })
  //      .catch(console.error);
  //  });
</script>

<main>
  {#await (async () => await wrapPosts(await fetchTimeline()))() then posts}
    <Posts {posts} />
  {/await}
</main>