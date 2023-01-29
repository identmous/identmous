<script lang="ts">
  import { Turnstile } from "svelte-turnstile";
  import { get } from "$lib/locale";
  import { login } from "$lib/client";
  import { CODES } from "$lib/const";
  import { TextField, Button } from "../../../attractions/attractions";

  const locale = get();
  let username = "";
  let password = "";
  let token = "";

  async function loginOnClick() {
    const res = await login(username, password, token);
    if (res.code === CODES.SUCCESS) {
      localStorage.setItem("token", res.token);
      location.href = "/";
    }
  }
</script>

<main>
  <div class="center margin">
    <TextField
      on:keydown={(e) => {
        if (e.detail.nativeEvent.code === "Enter") loginOnClick();
      }}
      bind:value={username}
      type="text" />
    <TextField
      on:keydown={(e) => {
        if (e.detail.nativeEvent.code === "Enter") loginOnClick();
      }}
      bind:value={password}
      type="password" />
    <Turnstile
      on:turnstile-callback={(e) => (token = e.detail.token)}
      siteKey="0x4AAAAAAABUMo1dcNjAIl1c"
      theme="dark" />
    <Button on:click={loginOnClick} filled>{locale.login}</Button>
    <p>a</p>
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
