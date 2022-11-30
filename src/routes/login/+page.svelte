<script lang="ts">
  import { Turnstile } from "svelte-turnstile";
  import { get } from "$lib/locale";
  import Link from "$lib/Link.svelte";
  import { login } from "$lib/client";
  import { CODES } from "$lib/const";

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

<div class="center-rl flex-col margin">
  <input
    on:keydown={(e) => {
      if (e.code === "Enter") loginOnClick();
    }}
    bind:value={username}
    type="text"
  />
  <input
    on:keydown={(e) => {
      if (e.code === "Enter") loginOnClick();
    }}
    bind:value={password}
    type="password"
  />
  <Turnstile
    on:turnstile-callback={(e) => (token = e.detail.token)}
    siteKey="0x4AAAAAAABUMo1dcNjAIl1c"
    theme="dark"
  />
  <Link on:click={loginOnClick} class="round center-tb" color="blue" type="button"
    >{locale.login}</Link
  >
</div>

<style lang="scss">
  .margin {
    * {
      margin: 8px;
    }
  }

  input {
    background-color: #171717;
    color: white;
    border-style: solid;
    border-color: gray;
    border-radius: 999999999999999999px;
    border-width: thin;
  }
</style>
