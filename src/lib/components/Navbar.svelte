<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import ThemeToggler from "./ThemeToggler.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { enhance } from "$app/forms";

  let { isAuthenticated }: { isAuthenticated: boolean } = $props();
</script>

<div class="p-2 shadow-sm backdrop-blur-xl">
  <div class="container mx-auto flex items-center justify-between">
    <span class="font-bold text-xl">NeoSpend</span>
    <div class="">
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Item One</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul class="w-75 p-2">
                <li>item one</li>
                <li>item two</li>
                <li>
                  <NavigationMenu.Link>Link</NavigationMenu.Link>
                </li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          {#if isAuthenticated}
            <NavigationMenu.Item>
              <NavigationMenu.Link>
                <form method="post" action="?/logout" use:enhance>
                  <button>Sign out</button>
                </form>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          {:else}
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/auth/login">Login</NavigationMenu.Link
              >
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/auth/register">
                <Button>Create Account</Button>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          {/if}

          <NavigationMenu.Item>
            <ThemeToggler />
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  </div>
</div>
