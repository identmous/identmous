<script lang="ts">
  let classes: string = "";
  export { classes as class };
  export let type: "normal" | "button" = "normal";
  export let href = "#";
  export let color: string = "default";

  switch (type) {
    case "normal":
      classes += " link";
      break;
    case "button":
      classes += " button";
      break;
  }

  switch (color) {
    case "blue":
      classes += " color-blue";
      break;
    default:
      classes += " color-default";
  }
</script>

<a on:click {...$$restProps} class={classes} {href}><slot /></a>

<style lang="scss">
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

  .button {
    padding: 1rem 4rem;
    height: fit-content;
    align-items: center;
    //min-width: max-content;
    max-width: max-content;
    &.color-default:hover {
      background-color: rgba(150, 150, 150, 0.1);
    }
    &.color-blue {
      background-color: rgb(29, 155, 240);
      &:hover {
        background-color: rgb(9, 135, 220);
      }
    }
    * {
      font-size: large;
    }
  }
</style>
