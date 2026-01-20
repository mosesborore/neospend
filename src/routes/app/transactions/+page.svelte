<script lang="ts">
  import type { PageProps } from "./$types";
  import { resolve } from "$app/paths";

  import Plus from "@lucide/svelte/icons/plus";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  import { cn } from "$lib/utils";
  import TransactionList from "$lib/components/transaction-list.svelte";

  const { data }: PageProps = $props();

  let total = $derived(
    data.transactions.reduce((acc, t) => (acc += t.amount), 0),
  );
</script>

<svelte:head>
  <title>Transactions</title>
</svelte:head>

<main>
  <header class="flex justify-between items-center">
    <div class="spacing-y-4">
      <h1 class="scroll-m-20 text-2xl font-semibold sm:text-3xl xl:text-4xl">
        Transactions
      </h1>
      <span class="text-muted-foreground">
        Create and manage your transactions
      </span>
    </div>

    <a
      href={resolve("/app/transactions/add")}
      class={cn(buttonVariants({ variant: "default", size: "sm" }), "max-w-xs")}
    >
      <Plus size={20} />
      Add Transaction
    </a>
  </header>

  <section id="stats" class="my-13">
    <div>
      <span>Total</span>
      <span>{total}</span>
    </div>
  </section>
  <section class="mt-12">
    <div class="mb-8 flex justify-between items-center">
      <h2 class="font-semibold text-muted-foreground">Recent Transactions</h2>
      <a
        href="/app/transactions"
        class={cn([buttonVariants({ variant: "outline", size: "sm" })])}
        >View All</a
      >
    </div>

    <div class="max-w-xl mx-auto">
      <TransactionList
        transactions={data.transactions}
        accounts={data.accounts}
      />
    </div>
  </section>
</main>
