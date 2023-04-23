<script context="module">
  export const prerender = false;
</script>

<script lang="ts">
  import type { Post, User } from "$lib/client";
  import { SNOWFLAKE } from "$lib/const";
  import Icon from "./Icon.svelte";
  import Wrapper from "./Wrapper.svelte";
  import { onMount } from "svelte";

  export let posts: Post[];
</script>

{#each posts as post}
  {@const user = post.user}
  <div class="post">
    <Wrapper>
      <div class="wrapper">
        <div class="margin">
          <Icon {user} size={48} />
        </div>
        <div>
          <p>
            {post.user.display_name || ""} <span class="hid">@{post.user.screen_name}</span>
            <span class="hid"
              >{Intl.DateTimeFormat([], { dateStyle: "long" }).format(
                new Date(Number(SNOWFLAKE.decode(post.id).timestamp))
              )}</span>
          </p>
          <p>{@html post.content}</p>
        </div>
      </div>
    </Wrapper>
  </div>
{/each}

<style lang="scss">
  @use "../../../attractions/attractions/variables" as vars;
  @use "sass:color";

  .post {
    border-bottom: solid 1px rgb(51, 51, 51);
  }

  .hid {
    color: #71767b;
  }

  p {
    margin: 0;
  }

  .wrapper {
    display: flex;
  }

  .margin {
    margin-right: 8px;
  }
</style>
