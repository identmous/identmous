<script lang="ts">
  import Link from "$lib/Link.svelte";
  import { init } from "$lib/locale";
  import type { User } from "$lib/client";
  import { fetchMe } from "$lib/client";
  import { onMount } from "svelte";

  let user: User | null;

  onMount(async () => {
    user = await fetchMe();
  });
</script>

{#await init()}
  <p class="center-rl center-tb">Loading</p>
{:then locale}
  <main class="flex">
    <div class="container center-rl flex-col">
      <Link class="round" type="button" href="/"><span>{locale.home}</span></Link>
      <Link class="round" type="button" href="/profile"><span>{locale.profile}</span></Link>
    </div>
    <div class="container-large flex-col">
      {#if location.pathname === "/login" || user}
        <slot />
      {:else}
        <div class="center-rl flex-col">
          <p>{locale.loginRequired}</p>
          <Link class="round center-tb" color="blue" type="button" href="/login"
            >{locale.login}</Link
          >
        </div>
      {/if}
    </div>
    <div class="container center-rl flex-col">
      <div class="round-soft highlight center-rl flex-col">
        <Link type="button" href="https://github.com/identmous/identmous">GitHub</Link>
        <Link type="button" href="https://github.com/identmous/identmous/issues">{locale.bugs}</Link
        >
      </div>
    </div>
  </main>
{/await}

<style lang="scss">
  :root {
    font-family: Arial, Helvetica, sans-serif;
  }

  @mixin container {
    border-right: 1px solid gray;
    padding: 5px;
    height: 100vh;
    * {
      margin: 8px;
    }
  }

  .container {
    @include container();
    width: 25vw;
  }

  .container-large {
    @include container();
    width: 50vw;
  }

  .highlight {
    background-color: #242424;
  }

  :global {
    .flex {
      display: flex;
      align-items: center;
      justify-content: center;
      .flex-col {
        display: flex;
        flex-direction: column;
      }
    }

    * {
      box-sizing: border-box;
    }

    .round {
      border-radius: 99999px;
    }

    .round-soft {
      border-radius: 4px;
    }

    html,
    body {
      background-color: #121212;
      color: white;
      margin: 0;
    }

    .center-tb {
      display: flex;
      justify-content: center;
    }

    .center-rl {
      display: flex;
      align-items: center;
    }

    .line-bottom {
      border-bottom: 1px solid gray;
    }
  }
</style>
