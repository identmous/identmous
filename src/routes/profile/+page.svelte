<script lang="ts">
  import { get, format } from "$lib/locale";
  import { fetchMe, fetchPosts } from "$lib/client";
  import { Snowflake } from "@sapphire/snowflake";

  const locale = get();
</script>

{#await fetchMe() then user}
  <h1 class="name line-bottom">{user?.display_name} (@{user?.screen_name})</h1>
  <div class="margin line-bottom">
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
  </div>

  {#await fetchPosts(user?.id || "") then posts}
    {#each posts.results as post}
      <div class="line-bottom">
        <p>
          {user?.display_name || ""} <span class="hid">@{user?.screen_name}</span>
          <span class="hid"
            >{Intl.DateTimeFormat([], { dateStyle: "long" }).format(
              new Date(
                Number(
                  new Snowflake(new Date("2022-11-20T00:00:00.000Z")).decode(post?.id || "")
                    .timestamp
                )
              )
            )}</span
          >
        </p>
        <p>{post.content}</p>
      </div>
    {/each}
  {/await}
{/await}

<style lang="scss">
  .name {
    font-size: x-large;
    font-weight: bold;
    padding-bottom: 1rem;
  }

  .margin {
    margin-bottom: 1rem;
  }

  .hid {
    color: gray;
  }

  p {
    line-height: 50%;
  }
</style>
