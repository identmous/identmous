<script lang="ts">
  import { get, format } from "$lib/locale";
  import { fetchMe, fetchPosts } from "$lib/client";
  import { Snowflake } from "@sapphire/snowflake";
  import { H1 } from "../../../attractions/attractions";
  import Posts from "$lib/components/Posts.svelte";
  import { wrapPosts } from "$lib/postWrapper";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import Icon from "$lib/components/Icon.svelte";
    import { SNOWFLAKE } from "$lib/const";

  const locale = get();
</script>

<main>
  {#await fetchMe() then user}
    {#if user}
      <div class="wrapper">
        <Wrapper>
          <div class="flex center"><Icon size={120} {user} chip={false} /></div>
          <H1>{user.display_name} (@{user.screen_name})</H1>
          <p>{user.bio}</p>
          <p class="hid">
            {format(
              locale.joined,
              Intl.DateTimeFormat([], { dateStyle: "long" }).format(
                new Date(
                  Number(
                    SNOWFLAKE.decode(user?.id || "")
                      .timestamp
                  )
                )
              )
            )}
          </p>
        </Wrapper>
      </div>

      {#await (async () => wrapPosts((await fetchPosts(user.id)).results))() then posts}
        <Posts {posts} />
      {/await}
    {/if}
  {/await}
</main>

<style lang="scss">
  @use "../../../attractions/attractions/variables" as vars;
  @use "sass:color";

  .wrapper {
    border-bottom: 1px solid rgb(51, 51, 51);
  }

  .hid {
    color: #71767b;
  }
</style>
