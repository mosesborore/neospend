<script lang="ts">
  import "./layout.css";
  import "$lib/assets/fonts/inter.css";

  import favicon from "$lib/assets/favicon.svg";

  import type { LayoutProps } from "./$types";

  const isAuthenticated = false;

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
