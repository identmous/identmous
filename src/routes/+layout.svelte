<script lang="ts">
  import { init } from "$lib/locale";
  import type { User } from "$lib/client";
  import { fetchMe } from "$lib/client";
  import { onMount } from "svelte";
  import {
    Accordion,
    Button,
    Dialog,
    Loading,
    TextField,
    Modal
  } from "../../attractions/attractions";
  import {
    HomeOutline,
    PersonOutline,
    PencilOutline,
    Home,
    Person,
    Pencil
  } from "svelte-ionicons";
  import If from "$lib/components/If.svelte";

  let innerWidth: number;
  let user: User;
  let isPostModalOpen = false;
  let isPostButtonDisabled = false;
  let postContent = "";
  let isMobile = false;
  $: {
    isMobile = innerWidth < 1056;
  }

  onMount(async () => {
    user = (await fetchMe()) as User;
  });

  async function postProcess() {
    isPostButtonDisabled = true;
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token") || ""
      },
      body: JSON.stringify({ content: postContent })
    }).catch(console.error);

    isPostButtonDisabled = false;
  }
</script>

<svelte:window bind:innerWidth />

{#await init()}
  <div class="center">
    <Loading />
  </div>
{:then locale}
  <main class="padded extra {isMobile ? 'column' : ''}">
    <nav class="wrapper" />
    <nav class="desktop left">
      <Accordion>
        {#if location.pathname === "/login" || user}
          <Button href="/">
            <div class="pad-right">
              <HomeOutline />
            </div>
            {locale.home}
          </Button>
          <Button href="/profile">
            <div class="pad-right">
              <PersonOutline />
            </div>
            {locale.profile}
          </Button>
          <Button
            filled
            class="btn-extra center"
            on:click={() => {
              isPostModalOpen = true;
            }}
            ><div class="pad-right"><PencilOutline /></div>
            <span>{locale.post}</span></Button>
        {:else}
          <Button filled href="/login">{locale.login}</Button>
        {/if}
      </Accordion>
    </nav>
    <Modal bind:open={isPostModalOpen} let:closeCallback>
      <Dialog title={locale.post} {closeCallback}
        ><TextField
          error={postContent.length > 140 && locale.invalidContentLength}
          multiline
          on:keydown={(e) => {
            if (
              !isPostButtonDisabled &&
              !e.detail.nativeEvent.repeat &&
              e.detail.nativeEvent.key === "Enter" &&
              e.detail.nativeEvent.ctrlKey
            )
              postProcess();
          }}
          bind:value={postContent} /><Button
          on:click={postProcess}
          bind:disabled={isPostButtonDisabled}
          filled
          class="btn-extra center btn-top-margin"
          ><div class="pad-right"><PencilOutline /></div>
          <span>{locale.post}</span></Button
        ></Dialog>
    </Modal>
    {#if !isMobile}
      <article>
        {#if location.pathname === "/login" || location.pathname === "/register" || user}
          <slot />
        {:else}
          <div class="center">
            <Button filled href="/login">{locale.login}</Button>
          </div>
        {/if}
      </article>
    {:else if location.pathname === "/login" || location.pathname === "/register" || user}
      <slot />
      <div class="footer">
        <a href="/"
          ><If
            condition={() => location.pathname === "/"}
            color="white"
            components={[HomeOutline, Home]} /></a>
        <Button
          filled
          round
          on:click={() => {
            isPostModalOpen = true;
          }}
          ><If
            condition={() => location.pathname === "/profile"}
            color="white"
            size="20"
            components={[PencilOutline, Pencil]} /></Button>
        <a href="/profile"
          ><If
            condition={() => location.pathname === "/profile"}
            color="white"
            components={[PersonOutline, Person]} /></a>
      </div>
    {:else}
      <div class="center">
        <Button filled href="/login">{locale.login}</Button>
      </div>
    {/if}
    <nav class="wrapper" />
    <nav class="desktop right">
      <Accordion>
        <Button href="https://github.com/identmous/identmous">GitHub</Button>
        <Button href="https://github.com/identmous/identmous/issues">{locale.bugs}</Button>
      </Accordion>
    </nav>
  </main>
{/await}

<style lang="scss">
  @use "sass:color";
  @use "../../attractions/docs/static/css/global.scss";
  @use "../../attractions/docs/static/css/routes/docs/layout";
  @use "../../attractions/docs/static/css/containers/docs/desktop-navigation.scss";
  @use "../../attractions/attractions/variables" as vars;

  article {
    @media only screen and (min-width: 1024px) {
      width: 50vw;
    }
  }

  .footer {
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    background-color: vars.$background;
    border-top: 1px solid color.adjust(vars.$main, $alpha: -0.75);
    justify-content: space-around;
    display: flex;
    * {
      padding: 0.5em;
    }
  }

  .column {
    flex-direction: column;
  }

  :global {
    .fat {
      width: 100%;
    }

    p {
      color: vars.$main-text;
    }

    .btn-extra {
      width: 100%;
      justify-content: center;
    }

    .btn-top-margin {
      margin-top: 1em;
    }

    .text-field {
      margin-bottom: 0.5em;
    }

    .flex {
      display: flex;
    }

    .center {
      justify-content: center;
    }

    .pad-right {
      padding-right: 1rem;
    }
  }
</style>
