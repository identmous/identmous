<script lang="ts">
  import { get } from "$lib/locale";

  const locale = get();
</script>

<h1>
  {locale.welcome}
</h1>