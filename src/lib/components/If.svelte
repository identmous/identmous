<script lang="ts">
  import { onMount, type SvelteComponentDev } from "svelte/internal";
  let cond = false;

  export let condition: () => boolean;
  export let components: [typeof SvelteComponentDev, typeof SvelteComponentDev];

  onMount(() => {
    const tid = setInterval(() => {
      cond = condition();
    });

    return () => clearInterval(tid);
  });
</script>

<svelte:component this={components[+cond]} {...$$restProps} />
