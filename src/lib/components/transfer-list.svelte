<script lang="ts">
  import type { Transfer } from "$lib/types";
  import TransferItem from "./transfer-item.svelte";

  let { transfers }: { transfers: Transfer[] } = $props();
</script>

<div class="flex flex-col gap-4 overflow-y-auto max-h-[80svh]">
  {#if transfers.length > 0}
    {#each transfers as transfer}
      <TransferItem {transfer} />
    {/each}
  {:else}
    <p class="text-center text-muted-foreground text-sm">
      No transfers to display.
    </p>
  {/if}
</div>
