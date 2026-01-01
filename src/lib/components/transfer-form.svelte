<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Textarea } from "$lib/components/ui/textarea";
  import type { Transfer } from "$lib/types";

  interface AccountOption {
    value: string;
    label: string;
  }
  interface TransferFormProps {
    accountOptions: AccountOption[];
    transfers: Transfer[];
  }

  const currencies = [
    { value: "kes", label: "Kenyan Shilling" },
    { value: "usd", label: "US Dollar" },
    { value: "euro", label: "Euro" },
    { value: "pound", label: "Sterling Pound" },
    { value: "cad", label: "Canadian Dollar" },
  ];

  let { accountOptions, transfers }: TransferFormProps = $props();

  let fromAccount = $state("");
  let toAccount = $state("");
  let amount = $state<number>(0);
  let currency = $state<string>("kes");
  let notes = $state("");

  const currencyLabel = $derived(
    currencies.find((c) => c.value === currency)?.label ?? "Choose currency"
  );

  const fromAccountLabel = $derived(
    accountOptions.find((a) => a.value === fromAccount)?.label ??
      "Choose the from account"
  );
  const toAccountLabel = $derived(
    accountOptions.find((a) => a.value === toAccount)?.label ??
      "Choose the to account"
  );

  // filtered accounts to display in select options for toAccount
  const toAccountsOptions = $derived(
    accountOptions.filter((a) => a.value !== fromAccount)
  );

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    transfers.push({
      id: "3",
      fromAccount: "Bank",
      toAccount: "MPESA",
      amount: 400,
    });
  }
</script>

<section id="transfer-form shadow-md">
  <div class="w-full">
    <h2 class="text-foreground font-semibold mb-4 text-sm">
      Transfer Details.
    </h2>
  </div>

  <form
    class="w-full max-w-4xl flex flex-col gap-6"
    method="post"
    onsubmit={handleSubmit}
  >
    <Field.Set>
      <Field.Group>
        <div class="grid grid-cols-2 gap-4">
          <Field.Field>
            <Field.Label>From</Field.Label>

            <Select.Root type="single" bind:value={fromAccount} name="account">
              <Select.Trigger>{fromAccountLabel}</Select.Trigger>
              <Select.Content>
                {#each accountOptions as account (account.value)}
                  <Select.Item {...account} />
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
          <Field.Field>
            <Field.Label>To</Field.Label>
            <Select.Root type="single" bind:value={toAccount} name="account">
              <Select.Trigger>{toAccountLabel}</Select.Trigger>
              <Select.Content>
                {#each toAccountsOptions as account (account.value)}
                  <Select.Item {...account} />
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
        </div>
      </Field.Group>

      <Field.Group>
        <div class="grid grid-cols-2 gap-4">
          <Field.Field>
            <Field.Label for="amount">Amount</Field.Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              bind:value={amount}
            />
          </Field.Field>
          <Field.Field>
            <Field.Label for="amount">Currency</Field.Label>
            <Select.Root type="single" bind:value={currency} name="currency">
              <Select.Trigger>{currencyLabel}</Select.Trigger>
              <Select.Content>
                {#each currencies as currency (currency.value)}
                  <Select.Item {...currency} />
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
        </div>
      </Field.Group>

      <Field.Group>
        <Field.Field>
          <Field.Label for="notes">Notes</Field.Label>
          <Textarea
            id="trans-notes"
            placeholder="Add any notes"
            class="resize-none"
            name="notes"
            bind:value={notes}
          />
        </Field.Field>
      </Field.Group>

      <Field.Separator />
      <Field.Field orientation="responsive">
        <Button type="submit" class="max-w-xs mx-auto">Transfer</Button>
      </Field.Field>
    </Field.Set>
  </form>
</section>
