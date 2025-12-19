<script lang="ts">
  import "./layout.css";
  import "$lib/assets/fonts/inter.css";

  import favicon from "$lib/assets/favicon.svg";

  import type { LayoutProps } from "./$types";
  import { page } from "$app/state";

  import { getFlash } from "sveltekit-flash-message";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  import X from "@lucide/svelte/icons/x";
  import CircleAlertIcon from "@lucide/svelte/icons/circle-alert";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";

  import Navbar from "$lib/components/Navbar.svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";

  const flash = getFlash(page);

  let { children, data }: LayoutProps = $props();

  let alertContainer = $state<HTMLDivElement | null>(null);

  function dismissAlert() {
    alertContainer?.remove();
    alertContainer = null;
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider>
  <AppSidebar />
  <div class="bg-background flex flex-col relative min-h-svh w-full">
    <header
      class="bg-background/90 sticky top-0 z-30 w-full backdrop-blur transition-shadow duration-100"
    >
      <div class="flex items-center p-1">
        <Sidebar.Trigger />
        <div class="flex-1">
          <Navbar isAuthenticated={data.isAuthenticated} />
        </div>
      </div>
    </header>

    {#if $flash}
      <section>
        <div class="container mx-auto mt-2" bind:this={alertContainer}>
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
                  >{$flash.message.description}</Alert.Description
                >
              {/if}

              <span class="ms-auto">
                <button onclick={() => dismissAlert()}> <X size="18" /></button>
              </span>
            </Alert.Root>
          </div>
        </div>
      </section>
    {/if}

    <main class="container mx-auto p-4 flex-1" id="mainContent">
      {@render children()}
    </main>
  </div>
</Sidebar.Provider>
