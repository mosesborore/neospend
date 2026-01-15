<script lang="ts">
  import { resolve } from "$app/paths";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils";
  import Plus from "@lucide/svelte/icons/plus";
</script>

<svelte:head>
  <title>Transactions</title>
</svelte:head>

<main>
  <header class="flex justify-between items-center">
    <h1
      class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl"
    >
      Transactions
    </h1>

    <a
      href={resolve("/app/transactions/add")}
      class={cn(buttonVariants({ variant: "default", size: "sm" }), "max-w-xs")}
    >
      <Plus size={20} />
      Add Transaction
    </a>
  </header>
</main>
