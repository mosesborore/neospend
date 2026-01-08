<script lang="ts">
  import "./layout.css";
  import "$lib/assets/fonts/inter.css";

  import favicon from "$lib/assets/favicon.svg";

  import type { LayoutProps } from "./$types";
  import { page } from "$app/state";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { getFlash } from "sveltekit-flash-message";
  import X from "@lucide/svelte/icons/x";
  import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";

  const flash = getFlash(page);

  let { children }: LayoutProps = $props();

  let alertContainer = $state<HTMLDivElement | null>(null);

  function dismissAlert() {
    alertContainer?.remove();
    alertContainer = null;
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
{#if $flash}
  <div class="flex justify-center">
    <section class="mx-4 relative flex-1">
      <div
        class="container mx-auto mt-2 absolute z-99"
        bind:this={alertContainer}
      >
        <div class="grid w-full max-w-xl items-start gap-4 mx-auto">
          <Alert.Root
            variant={$flash.type === "error" ? "destructive" : "default"}
            class="flex"
          >
            {#if $flash.type === "success"}
              <CheckCircle2Icon />
            {:else}
              <CircleAlertIcon class="size-4" />
            {/if}
            <Alert.Title>{$flash.message.title}</Alert.Title>
            {#if $flash.message.description}
              <Alert.Description
                >{$flash.message?.description}</Alert.Description
              >
            {/if}

            <span class="ms-auto">
              <button onclick={() => dismissAlert()}> <X size="18" /></button>
            </span>
          </Alert.Root>
        </div>
      </div>
    </section>
  </div>
{/if}

{@render children()}
