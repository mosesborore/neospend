<script lang="ts">
  import type { TransactionType } from "$lib/types";
  import * as Item from "$lib/components/ui/item/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import MoreVertical from "@lucide/svelte/icons/more-horizontal";
  import Dot from "@lucide/svelte/icons/dot";
  import { cn, formatAmount } from "$lib/utils";

  interface PropsType {
    transactions: TransactionType[];
    accounts: { id: string; name: string }[];
  }

  let { transactions, accounts }: PropsType = $props();
</script>

<div class="flex flex-col gap-4 overflow-y-auto max-h-[80svh]">
  {#if transactions.length > 0}
    {#each transactions as transaction}
      {@render item(transaction)}
    {/each}
  {:else}
    <p class="text-center text-muted-foreground text-sm">
      No transactions. Please add.
    </p>
  {/if}
</div>

{#snippet item(transaction: TransactionType)}
  <div id="item">
    <Item.Root variant="outline">
      <Item.Content>
        <Item.Title>{transaction.name}</Item.Title>
        <Item.Description class="text-xs">
          <span>21 Dec</span>
          <Dot size="20" class="inline font-bold" />
          <span>
            {accounts.find((a) => a.id === transaction.accountId)?.name}</span
          >
        </Item.Description>
      </Item.Content>
      <Item.Actions class="flex gap-4 items-center">
        <span
          class={cn(
            "font-semibold text-base",
            transaction.type === "expense" ? "text-red-700" : "text-green-500",
          )}
        >
          {transaction.type === "expense" ? "-" : "+"}
          {formatAmount(transaction.amount)}</span
        >
        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </Item.Actions>
    </Item.Root>
  </div>
{/snippet}
