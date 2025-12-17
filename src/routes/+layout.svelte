<script lang="ts">
  import "./layout.css";
  import "$lib/assets/fonts/inter.css";

  import favicon from "$lib/assets/favicon.svg";

  import { page } from "$app/state";

  import Navbar from "$lib/components/Navbar.svelte";
  import { ModeWatcher } from "mode-watcher";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
  import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";

  import { getFlash } from "sveltekit-flash-message";
  import type { LayoutProps } from "./$types";

  const flash = getFlash(page);

  let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<Navbar isAuthenticated={data.isAuthenticated} />

{#if $flash}
  <div class="container mx-auto mt-4">
    <div class="grid w-full max-w-xl items-start gap-4 mx-auto">
      <Alert.Root variant={$flash.type === "error" ? "destructive" : "default"}>
        {#if $flash.type === "success"}
          <CheckCircle2Icon />
        {:else}
          <CircleAlertIcon class="size-4" />
        {/if}
        <Alert.Title>{$flash.message.title}</Alert.Title>
        {#if $flash.message.description}
          <Alert.Description>{$flash.message.description}</Alert.Description>
        {/if}
      </Alert.Root>
    </div>
  </div>
{/if}

<div class="container mx-auto p-4">
  {@render children()}
</div>
