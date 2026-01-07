<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";

  import ThemeToggler from "./theme-controller.svelte";
  import { enhance } from "$app/forms";

  const isAuthenticated = false;
</script>

<nav class="flex items-center gap-x-4 h-6 p-2">
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <ThemeToggler />
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
</nav>
