<script lang="ts">
  import "./layout.css";
  import "$lib/assets/fonts/inter.css";

  import favicon from "$lib/assets/favicon.svg";

  import type { LayoutProps } from "./$types";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import ThemeToggler from "$lib/components/theme-controller.svelte";
  import { enhance } from "$app/forms";

  const isAuthenticated = false;

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="flex items-center h-10 p-4">
  <div>
    <span>NeoSpend</span>
  </div>

  <div class="ms-auto text-sm">
    <NavigationMenu.Root>
      <NavigationMenu.List class="gap-x-2">
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        {#if isAuthenticated}
          <NavigationMenu.Item>
            <NavigationMenu.Link>
              <form method="post" action="/app?/logout" use:enhance>
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
</nav>

{@render children()}
