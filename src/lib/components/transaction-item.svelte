<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import Dot from "@lucide/svelte/icons/dot";
  import type { Transaction } from "$lib/types";

  let { transaction }: { transaction: Transaction } = $props();
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
      <Button variant="outline" size="sm">
        <Trash2 class="size-4" color="red" />
      </Button>
    </Item.Actions>
  </Item.Root>
</div>
