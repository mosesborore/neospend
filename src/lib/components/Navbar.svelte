<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import ThemeToggler from "./theme-controller.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { enhance } from "$app/forms";

  let { isAuthenticated }: { isAuthenticated: boolean } = $props();
</script>

<div class="flex items-center justify-end">
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
      </NavigationMenu.Item>
      {#if isAuthenticated}
        <NavigationMenu.Item>
          <NavigationMenu.Link>
            <form method="post" action="/?/logout" use:enhance>
              <button type="submit" class="text-sm hover:underline"
                >Sign out</button
              >
            </form>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {:else}
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/auth/login">Login</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/auth/register">
            Register
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {/if}
      <NavigationMenu.Item>
        <ThemeToggler />
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
</div>
