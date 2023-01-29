<script lang="ts">
  import { get } from "$lib/locale";
  import { H1 } from "../../attractions/attractions";

  const locale = get();
</script>

<main>
  <H1>
    {locale.welcome}
  </H1>
</main>
