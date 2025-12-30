<script lang="ts">
  import type { Transaction } from "$lib/types";
  import TransactionItem from "./transaction-item.svelte";

  let { transactions }: { transactions: Transaction[] } = $props();
</script>

<div class="flex flex-col gap-4 overflow-y-auto max-h-[80svh]">
  {#if transactions.length > 0}
    {#each transactions as transaction}
      <TransactionItem {transaction} />
    {/each}
  {:else}
    <p class="text-center text-muted-foreground text-sm">
      No transactions. Please add.
    </p>
  {/if}
</div>
