<script lang="ts">
  import HouseIcon from "@lucide/svelte/icons/house";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import LogOut from "@lucide/svelte/icons/log-out";
  import TagIcon from "@lucide/svelte/icons/tag";
  import Wallet from "@lucide/svelte/icons/wallet";
  import DollarSign from "@lucide/svelte/icons/dollar-sign";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { enhance } from "$app/forms";

  //Menu items

  const ROOT_PATH = "/app";

  const items = [
    {
      title: "Dashboard",
      url: `${ROOT_PATH}`,
      icon: HouseIcon,
    },

    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
  ];

  const transactionAttributes = [
    {
      title: "Transactions",
      url: `${ROOT_PATH}/transactions`,
      icon: DollarSign,
    },

    {
      title: "Accounts",
      url: `${ROOT_PATH}/accounts`,
      icon: Wallet,
    },
    {
      title: "Categories",
      url: `${ROOT_PATH}/categories`,
      icon: TagIcon,
    },
  ];

  let currentPath = $state("/");
</script>

<Sidebar.Root>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton>
          <span class="font-bold text-lg">NeoSpend</span>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Overview</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => (currentPath = item.url)}
                isActive={currentPath === item.url}
              >
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Transaction Attributes</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each transactionAttributes as attribute (attribute.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => (currentPath = attribute.url)}
                isActive={currentPath === attribute.url}
              >
                {#snippet child({ props })}
                  <a href={attribute.url} {...props}>
                    <attribute.icon />
                    <span>{attribute.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer class="items-start">
    <form method="post" action="/app?/logout" use:enhance>
      <Button variant="ghost" class="hover:underline" type="submit"
        >Log Out <LogOut /></Button
      >
    </form>
  </Sidebar.Footer>
</Sidebar.Root>
