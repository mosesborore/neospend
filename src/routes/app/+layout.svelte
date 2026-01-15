<script lang="ts">
  import type { LayoutProps } from "./$types";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  import Navbar from "$lib/components/Navbar.svelte";
  import AppSidebar from "$lib/components/app-sidebar.svelte";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<Sidebar.Provider>
  <AppSidebar />
  <div class="bg-background min-h-svh w-full">
    <header
      class="bg-background/90 sticky top-0 z-30 w-full backdrop-blur transition-shadow duration-100"
    >
      <div class="flex items-center p-2">
        <Sidebar.Trigger />
        <div class="ms-auto">
          <Navbar />
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 mt-4" id="mainContent">
      {@render children()}
    </main>
  </div>
</Sidebar.Provider>
