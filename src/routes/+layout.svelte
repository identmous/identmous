<script>
  import Link from "$lib/Link.svelte";
</script>
<main class="flex">
  <div class="container">
    <Link href="/">Home</Link>
  </div>
  <div class="container flex-col main">
    <slot />
  </div>
</main>

<style lang="scss">
  :root {
    font-family: Arial, Helvetica, sans-serif;
  }

  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
    .flex-col {
      flex-direction: column;
      width: 85vw;
    }
  }

  .container {
    border-right: 1px solid gray;
    padding: 5px;
    height: 100vh;
    width: 15vw;
  }

  :global {
    * {
      box-sizing: border-box;
    }

    html, body {
      background-color: black;
      color: white;
    }

    a {
      text-decoration: none;
      color: white;
      &.link {
        color: rgb(29, 155, 240);
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>