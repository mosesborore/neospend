<script lang="ts">
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Textarea } from "$lib/components/ui/textarea";
  import { useSidebar } from "$lib/components/ui/sidebar";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";

  import type { TransactionType, Transfer } from "$lib/types";
  import { cn } from "$lib/utils";
  import TransactionList from "$lib/components/transaction-list.svelte";
  import TransferList from "$lib/components/transfer-list.svelte";
  import TransferForm from "$lib/components/transfer-form.svelte";
  import type { PageProps } from "./$types";
  import { superForm } from "sveltekit-superforms";

  let sidebar = useSidebar();

  let { data }: PageProps = $props();

  let transactions = $state<TransactionType[]>([]);

  const getTransactionForm = () => data.addTransactionForm;

  let {
    form: transactionForm,

    constraints,
    enhance,
    delayed,
    errors,
  } = superForm(getTransactionForm(), {
    resetForm: true,
    onUpdated: ({ form }) => {
      if (form.valid) {
        transactions.push(form.message.newTransaction);
        console.log("form submitted successfully.");
      }
    },
  });

  const getAccountsOptions = () => data.accountOptions;

  const accountsOptions = getAccountsOptions();

  const transactionTypes = [
    {
      value: "expense",
      label: "Expense",
    },
    {
      value: "income",
      label: "Income",
    },
    {
      value: "transfer",
      label: "Transfer",
    },
  ];

  const currencies = [
    { value: "kes", label: "Kenyan Shilling" },
    { value: "usd", label: "US Dollar" },
    { value: "euro", label: "Euro" },
    { value: "pound", label: "Sterling Pound" },
    { value: "cad", label: "Canadian Dollar" },
  ];

  const accountLabel = $derived(
    accountsOptions.find((a) => a.value === $transactionForm.accountId)
      ?.label ?? "Choose account"
  );

  const transactionTypeLabel = $derived(
    transactionTypes.find((t) => t.value === $transactionForm.type)?.label ??
      "Choose transaction type"
  );

  const categoryOptions = $derived(
    $transactionForm.type === "expense"
      ? data.expenseOptions
      : data.incomeOptions
  );
  const categoryLabel = $derived.by(() => {
    return (
      categoryOptions?.find((i) => i.value === $transactionForm.categoryId)
        ?.label ?? "Choose category"
    );
  });

  const currencyLabel = $derived(
    currencies.find((c) => c.value === $transactionForm.currency)?.label ??
      "Choose currency"
  );
  // TRANSFERRING
  let isTransfer = $derived($transactionForm.type === "transfer");

  let transfers = $state<Transfer[]>([]);
</script>

<svelte:head>
  <title>Transactions</title>
</svelte:head>

<div>
  <header class="space-y-2 border-b pb-4">
    <h1
      class="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-3xl xl:text-4xl"
    >
      Add Transactions
    </h1>
  </header>

  <div
    class={cn([
      "grid mb-20",
      "gap-12",
      "mt-8",
      !sidebar.isMobile && sidebar.open
        ? "max-xl:grid-cols-1 xl:grid-cols-2"
        : "grid-cols-2 max-lg:grid-cols-1",
    ])}
  >
    <section class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-6">
        <!-- <h2 class="text-muted-foreground font-semibold">Add Transaction</h2> -->

        <Field.Set>
          <Field.Label for="transactionTypeRadio">Transaction Type</Field.Label>
          <Field.Description
            >Select the type of this transaction.</Field.Description
          >
          <RadioGroup.Root
            bind:value={$transactionForm.type}
            class="grid grid-cols-3 gap-4"
            name="transactionTypeRadio"
          >
            <Field.Label for="expense-type">
              <Field.Field orientation="horizontal">
                <Field.Content>
                  <Field.Title>Expense</Field.Title>
                </Field.Content>
                <RadioGroup.Item value="expense" id="expense-type" />
              </Field.Field>
            </Field.Label>
            <Field.Label for="income-type">
              <Field.Field orientation="horizontal">
                <Field.Content>
                  <Field.Title>Income</Field.Title>
                </Field.Content>
                <RadioGroup.Item value="income" id="income-type" />
              </Field.Field>
            </Field.Label>
            <Field.Label for="transfer-type">
              <Field.Field orientation="horizontal">
                <Field.Content>
                  <Field.Title>Transfer</Field.Title>
                </Field.Content>
                <RadioGroup.Item value="transfer" id="transfer-type" />
              </Field.Field>
            </Field.Label>
          </RadioGroup.Root>
        </Field.Set>

        <Field.Separator />

        {#if isTransfer}
          <TransferForm accountOptions={accountsOptions} {transfers} />
        {:else}
          <div class="w-full">
            <h2 class="font-semibold mb-2 text-sm">Transaction Details.</h2>
          </div>

          <form
            method="POST"
            class="w-full max-w-4xl flex flex-col gap-6"
            action="?/addTransaction"
            use:enhance
          >
            <Field.Set>
              <Field.Group>
                <Field.Field>
                  <Field.Label for="name">Name</Field.Label>
                  <Input
                    id="name"
                    name="name"
                    autocomplete="off"
                    placeholder="Name"
                    bind:value={$transactionForm.name}
                    {...$constraints.name}
                  />
                  {#if $errors.name}
                    <Field.Description>{$errors.name}</Field.Description>
                  {/if}
                </Field.Field>
                <Field.Group>
                  <div class={cn("grid gap-6")}>
                    <Field.Field>
                      <Field.Label for="type">Transaction Type</Field.Label>
                      <Select.Root
                        type="single"
                        bind:value={$transactionForm.type}
                        name="type"
                      >
                        <Select.Trigger>{transactionTypeLabel}</Select.Trigger>
                        <Select.Content>
                          {#each transactionTypes as transactionType (transactionType.value)}
                            <Select.Item {...transactionType} />
                          {/each}
                        </Select.Content>
                      </Select.Root>
                      {#if $errors.type}
                        <Field.Description>{$errors.type}</Field.Description>
                      {/if}
                    </Field.Field>
                  </div>
                </Field.Group>

                <Field.Field>
                  <Field.Label for="category">Category</Field.Label>
                  <Select.Root
                    type="single"
                    bind:value={$transactionForm.categoryId}
                    name="categoryId"
                    {...$constraints.categoryId}
                  >
                    <Select.Trigger>{categoryLabel}</Select.Trigger>
                    <Select.Content>
                      {#each categoryOptions as categoryOption (categoryOption.value)}
                        <Select.Item {...categoryOption} />
                      {/each}
                    </Select.Content>
                  </Select.Root>
                  {#if $errors.categoryId}
                    <Field.Description>{$errors.categoryId}</Field.Description>
                  {/if}
                </Field.Field>
                <Field.Set>
                  <Field.Legend>Account</Field.Legend>
                  <Field.Description
                    >Account the transaction occurred in.</Field.Description
                  >
                  <Field.Group>
                    <Field.Field>
                      <Select.Root
                        type="single"
                        bind:value={$transactionForm.accountId}
                        name="accountId"
                      >
                        <Select.Trigger>{accountLabel}</Select.Trigger>
                        <Select.Content>
                          {#each accountsOptions as account (account.value)}
                            <Select.Item {...account} />
                          {/each}
                        </Select.Content>
                      </Select.Root>
                      {#if $errors.accountId}
                        <Field.Description
                          >{$errors.accountId}</Field.Description
                        >
                      {/if}
                    </Field.Field>
                  </Field.Group>
                </Field.Set>

                <Field.Group>
                  <div class="grid grid-cols-2 gap-4">
                    <Field.Field>
                      <Field.Label for="amount">Amount</Field.Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        bind:value={$transactionForm.amount}
                        {...$constraints.amount}
                      />
                      {#if $errors.amount}
                        <Field.Description>{$errors.amount}</Field.Description>
                      {/if}
                    </Field.Field>
                    <Field.Field>
                      <Field.Label for="currency">Currency</Field.Label>
                      <Select.Root
                        type="single"
                        bind:value={$transactionForm.currency}
                        name="currency"
                      >
                        <Select.Trigger>{currencyLabel}</Select.Trigger>
                        <Select.Content>
                          {#each currencies as currency (currency.value)}
                            <Select.Item {...currency} />
                          {/each}
                        </Select.Content>
                      </Select.Root>
                      {#if $errors.currency}
                        <Field.Description>{$errors.currency}</Field.Description
                        >
                      {/if}
                    </Field.Field>
                  </div>
                </Field.Group>
              </Field.Group>
            </Field.Set>
            <Field.Set>
              <Field.Group>
                <Field.Field>
                  <Field.Label for="notes">Notes</Field.Label>
                  <Textarea
                    id="trans-notes"
                    placeholder="Add any notes"
                    class="resize-none"
                    name="notes"
                    bind:value={$transactionForm.notes}
                  />
                  {#if $errors.notes}
                    <Field.Description>{$errors.notes}</Field.Description>
                  {/if}
                </Field.Field>
              </Field.Group>
            </Field.Set>
            <Field.Separator />
            <Field.Field orientation="responsive">
              <Button type="submit" class="max-w-xs mx-auto">
                Add
                {#if $delayed}
                  <Spinner />
                {/if}
              </Button>
            </Field.Field>
          </form>
        {/if}
      </div>
    </section>

    <section class="flex gap-12 flex-col">
      <div id="transactions">
        <h2 class="mb-4 text-muted-foreground font-semibold">Transactions</h2>
        <TransactionList {transactions} accounts={data.accounts} />
      </div>
      <div id="transfers">
        <h2 class="mb-4 text-muted-foreground font-semibold">Transfers</h2>
        <TransferList {transfers} />
      </div>
    </section>
  </div>
</div>
