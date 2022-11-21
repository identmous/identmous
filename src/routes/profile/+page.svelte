<script lang="ts">
  import { get } from "$lib/locale";
  import { login } from "$lib/client";

  const locale = get();
</script>

{#await login() then user}
  <h1 class="name line-bottom">{user?.display_name} (@{user?.screen_name})</h1>
  <p>id: {user?.id}</p>
{/await}

<style lang="scss">
  .name {
    font-size: x-large;
    font-weight: bold;
    padding-bottom: 1rem;
  }
</style>