<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import type { Transfer } from "$lib/types";
  import MoreVertical from "@lucide/svelte/icons/more-vertical";

  let { transfer }: { transfer: Transfer } = $props();
</script>

<div id="item">
  <Item.Root variant="outline">
    <Item.Content>
      <Item.Title>
        <span>{transfer.fromAccount}</span>
        <ArrowRight size="18" class="inline font-bold" />
        <span> {transfer.toAccount}</span>
      </Item.Title>
      <Item.Description class="text-xs">Transfer</Item.Description>
    </Item.Content>
    <Item.Actions class="flex gap-4 items-center">
      <span class="font-semibold text-base text-purple-600"
        >{transfer.amount}</span
      >
      <Button variant="ghost" size="icon">
        <MoreVertical />
      </Button>
    </Item.Actions>
  </Item.Root>
</div>
