<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";

  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index";
  import ThemeToggler from "$lib/components/theme-controller.svelte";
  import { cn } from "$lib/utils";
</script>

<div class="container mx-auto">
  <nav class="flex items-center h-10 py-4">
    <span class="text-lg font-semibold">NeoSpend</span>
    <NavigationMenu.Root class="ms-auto">
      <NavigationMenu.List class="gap-x-2">
        <NavigationMenu.Item>
          <ThemeToggler />
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </nav>
</div>
<main class="container mx-auto min-h-screen flex items-center justify-center">
  <section class=" p-10 rounded-md space-y-4 max-w-lg">
    <p class="font-semibold text-2xl">It seems something has gone wrong</p>
    <p class="font-bold text-xl text-center text-muted-foreground">
      {page.status}: {page.error?.message}
    </p>
    <div class="flex justify-center">
      <a
        href={resolve("/app")}
        class={cn(buttonVariants({ variant: "link" }), "mx-auto")}
        ><ArrowLeft />Go back home</a
      >
    </div>
  </section>
</main>
