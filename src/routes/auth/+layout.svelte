<script lang="ts">
  import type { LayoutProps } from "./$types";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import ThemeToggler from "$lib/components/theme-controller.svelte";

  let { children }: LayoutProps = $props();
</script>

<div class="container mx-auto">
  <nav class="flex items-center h-10 py-4">
    <span class="text-lg font-semibold">NeoSpend</span>
    <NavigationMenu.Root class="ms-auto">
      <NavigationMenu.List class="gap-x-2">
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/auth/login">Login</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/auth/register">
            Register
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <ThemeToggler />
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </nav>
</div>

{@render children()}
