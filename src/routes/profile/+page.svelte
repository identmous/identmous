<script lang="ts">
  import { get, format } from "$lib/locale";
  import { fetchMe, fetchPosts } from "$lib/client";
  import { Snowflake } from "@sapphire/snowflake";
  import { Divider, H1 } from "../../../attractions/attractions";

  const locale = get();
</script>

{#await fetchMe() then user}
  <H1>{user?.display_name} (@{user?.screen_name})</H1>
  <p>{user?.bio}</p>
  <p class="hid">
    {format(
      locale.joined,
      Intl.DateTimeFormat([], { dateStyle: "long" }).format(
        new Date(
          Number(
            new Snowflake(new Date("2022-11-20T00:00:00.000Z")).decode(user?.id || "").timestamp
          )
        )
      )
    )}
  </p>
  <Divider />

  {#await fetchPosts(user?.id || "") then posts}
    {#each posts.results as post}
      <p>
        {user?.display_name || ""} <span class="hid">@{user?.screen_name}</span>
        <span class="hid"
          >{Intl.DateTimeFormat([], { dateStyle: "long" }).format(
            new Date(
              Number(
                new Snowflake(new Date("2022-11-20T00:00:00.000Z")).decode(post?.id || "").timestamp
              )
            )
          )}</span>
      </p>
      <p>{post.content}</p>
      <Divider />
    {/each}
  {/await}
{/await}

<style lang="scss">
  @use "../../../attractions/attractions/variables" as vars;
  @use "sass:color";

  .hid {
    color: #71767b;
  }
</style>
