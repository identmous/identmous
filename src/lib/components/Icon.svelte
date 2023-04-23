<script lang="ts">
  import type { User } from "$lib/client";
  import { fade } from "svelte/transition";
  let isChipVisible = false;
  let innerWidth: number;
  let isMobile = false;
  $: {
    isMobile = innerWidth < 1056;
  }

  export let user: User;
  export let size = 48;
  export let chip = true;
</script>

<svelte:window bind:innerWidth />

<div>
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <a
    href="/users/{user.id}"
    on:mouseover={() => (isChipVisible = true)}
    on:mouseleave={() => (isChipVisible = false)}>
    <img src={user.avatar_url} alt="{user.display_name}'s icon" height={size} width={size} />
    {#if !isMobile && chip && isChipVisible}
      <div out:fade class="modal">
        <div class="flex center"><p>{user.bio}</p></div>
      </div>
    {/if}
  </a>
</div>

<style lang="scss">
  @use "../../../attractions/attractions/variables" as vars;

  img {
    border-radius: 99999999px;
    border-style: solid;
    border-color: vars.$main;
  }

  .modal {
    position: absolute;
    background-color: vars.$background;
    width: 240px;
    height: 120px;
    box-shadow: vars.$shadow-raised;
    border-radius: 8px;
    transition: 0.2s;
  }
</style>
