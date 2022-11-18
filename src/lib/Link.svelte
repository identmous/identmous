<script lang="ts">
  let classes: string = "";
  export {classes as class};
  export let underline = false;
  export let href = "#";
</script>

<a {...$$restProps} class={classes + (underline ? " link" : "")} {href}><slot/></a>