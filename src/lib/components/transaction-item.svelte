<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import MoreVertical from "@lucide/svelte/icons/more-horizontal";
  import Dot from "@lucide/svelte/icons/dot";
  import type { TransactionType } from "$lib/types";

  let { transaction }: { transaction: TransactionType } = $props();
</script>

<div id="item">
  <Item.Root variant="outline">
    <Item.Content>
      <Item.Title>{transaction.name}</Item.Title>
      <Item.Description class="text-xs">
        <span>21 Dec</span>
        <Dot size="20" class="inline font-bold" />
        <span> {transaction.account}</span>
      </Item.Description>
    </Item.Content>
    <Item.Actions class="flex gap-4 items-center">
      <span class="font-semibold text-base">{transaction.amount}</span>
      <Button variant="ghost" size="icon">
        <MoreVertical />
      </Button>
    </Item.Actions>
  </Item.Root>
</div>
