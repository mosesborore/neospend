<script lang="ts">
  import { resolve } from "$app/paths";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<svelte:head>
  <title>Transactions</title>
</svelte:head>

<main>
  <header class="space-y-4">
    <h1
      class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl"
    >
      Transactions
    </h1>

    <a
      href={resolve("/app/transactions/add")}
      class={buttonVariants({ variant: "default", size: "sm" })}
      >Add Transaction</a
    >
  </header>
</main>
