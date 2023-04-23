<script lang="ts">
  import { get, format } from "$lib/locale";
  import { fetchPosts, fetchUser, follow, unfollow } from "$lib/client";
  import { H1, Button } from "../../../../attractions/attractions";
  import { page } from "$app/stores";
  import Posts from "$lib/components/Posts.svelte";
  import { wrapPosts } from "$lib/postWrapper";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { SNOWFLAKE } from "$lib/const";
  import { PersonAdd, PersonRemove } from "svelte-ionicons";
  import { fetchFollow } from "$lib/client";
  import If from "$lib/components/If.svelte";
  let innerWidth = 0;
  let isMobile = false;
  let isFollowing = false;
  $: {
    isMobile = innerWidth < 1056;
  }

  onMount(async () => {
    if (browser) {
      const token = localStorage.getItem("token");
      if (!token) {
        location.href = "/login";
      }

      const userId = atob(token!.split(".")[0]);
      if (userId === $page.params.id) {
        location.href = "/profile";
      }
    }
    isFollowing = !!(await fetchFollow($page.params.id))?.result;
  });

  const locale = get();
</script>

<svelte:window bind:innerWidth />

<main>
  {#await fetchUser($page.params.id) then user}
    {#if user}
      <div class="wrapper">
        <Wrapper>
          <div class="flex center"><Icon size={120} {user} chip={false} /></div>
          <div class="head">
            <H1>{user.display_name} (@{user.screen_name})</H1>
            {#if !isMobile}
              <Button
                filled={!isFollowing}
                outline={isFollowing}
                on:click={() => {
                  (isFollowing ? unfollow : follow)($page.params.id).then(() => (isFollowing = !isFollowing));
                }}>
                <div class="pad-right">
                  <If condition={() => isFollowing} components={[PersonAdd, PersonRemove]} />
                </div>
                {isFollowing ? locale.unfollow : locale.follow}
              </Button>
            {/if}
          </div>
          {#if isMobile}
            <Button
              filled={!isFollowing}
              outline={isFollowing}
              class="center flex fat"
              on:click={() => {
                (isFollowing ? unfollow : follow)($page.params.id).then(() => (isFollowing = !isFollowing));
              }}>
              <div class="pad-right">
                <If condition={() => isFollowing} components={[PersonAdd, PersonRemove]} />
              </div>
              {isFollowing ? locale.unfollow : locale.follow}
            </Button>
          {/if}
          <p>{user.bio}</p>
          <p class="hid">
            {format(
              locale.joined,
              Intl.DateTimeFormat([], { dateStyle: "long" }).format(
                new Date(Number(SNOWFLAKE.decode(user.id).timestamp))
              )
            )}
          </p>
        </Wrapper>
      </div>

      {#await (async () => await wrapPosts((await fetchPosts(user.id || "")).results))() then posts}
        <Posts {posts} />
      {/await}
    {:else}
      <p class="center">は？</p>
    {/if}
  {/await}
</main>

<style lang="scss">
  @use "../../../../attractions/attractions/variables" as vars;
  @use "sass:color";

  .fat {
    width: 100%;
  }

  .wrapper {
    border-bottom: 1px solid rgb(51, 51, 51);
  }

  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    .button {
      align-self: flex-end;
    }
  }

  .hid {
    color: #71767b;
  }

  .right {
    display: flex;
    justify-content: flex-end;
  }
</style>
