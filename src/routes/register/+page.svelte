<script lang="ts">
  import { Turnstile } from "svelte-turnstile";
  import { get } from "$lib/locale";
  import { TextField, Button } from "../../../attractions/attractions";

  const locale = get();
  let displayName = "";
  let screenName = "";
  let password = "";
  let token = "";

  async function register() {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ displayName, screenName, password, turnstileToken: token })
    });
    if (!res.ok) location.href = "/register";
    location.href = "/login";
  }
</script>

<main>
  <div class="center margin">
    <TextField bind:value={displayName} placeholder={locale.name} type="text" />
    <TextField bind:value={screenName} placeholder={locale.userName} type="text" />
    <TextField bind:value={password} placeholder={locale.password} type="password" />
    <Turnstile
      on:turnstile-callback={(e) => (token = e.detail.token)}
      siteKey="0x4AAAAAAABUMo1dcNjAIl1c"
      theme="dark" />
    <Button on:click={register} filled>{locale.register}</Button>
  </div>
</main>

<style lang="scss">
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 2em;
  }
</style>
