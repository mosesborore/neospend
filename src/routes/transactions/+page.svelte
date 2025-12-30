<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Textarea } from "$lib/components/ui/textarea";
  import { useSidebar } from "$lib/components/ui/sidebar";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";

  import type { SelectInputOption, Transaction } from "$lib/types";
  import { cn } from "$lib/utils";
  import TransactionList from "$lib/components/transaction-list.svelte";
  import TransferForm from "$lib/components/transfer-form.svelte";
  import type { PageProps } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import SuperDebug from "sveltekit-superforms";

  let sidebar = useSidebar();

  let { data }: PageProps = $props();

  const getTransactionForm = () => data.addTransactionForm;
  const getAccountForm = () => data.accountForm;

  let {
    form: transactionForm,
    message,
    constraints,
    enhance,
  } = superForm(getTransactionForm(), {
    resetForm: true,
    onError: ({ result }) => {
      console.log("Something went wrong: ", result);
    },
  });

  let { form: accountForm, constraints: accountConstraints } = superForm(
    getAccountForm(),
    {
      resetForm: true,
      onError: ({ result }) => {
        console.log("Something went wrong: ", result);
      },
    }
  );

  const getAccounts = () => {
    let c: SelectInputOption[] = [];

    data.accounts.forEach((a) => {
      c.push({ value: a.id, label: a.name });
    });

    return c;
  };

  const accounts = getAccounts();

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

  const categories = [
    {
      type: "expense",
      options: [
        {
          value: "rent",
          label: "Rent",
        },
        {
          value: "shopping",
          label: "Shopping",
        },
      ],
    },
    {
      type: "income",
      options: [
        {
          value: "salary",
          label: "Salary",
        },
      ],
    },
    {
      type: "transfer",
      options: [
        {
          value: "transfer",
          label: "Transfer",
        },
      ],
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
    accounts.find((a) => a.value === $transactionForm.account)?.label ??
      "Choose account"
  );

  let transactions = $state<Transaction[]>([]);

  const transactionTypeLabel = $derived(
    transactionTypes.find((t) => t.value === $transactionForm.type)?.label ??
      "Choose transaction type"
  );

  const categoryOptions = $derived(
    categories.find((c) => c.type === $transactionForm.type)?.options ?? []
  );
  const categoryLabel = $derived.by(() => {
    return (
      categoryOptions?.find((i) => i.value === $transactionForm.category)
        ?.label ?? "Choose category"
    );
  });

  const currencyLabel = $derived(
    currencies.find((c) => c.value === $transactionForm.currency)?.label ??
      "Choose currency"
  );
  // TRANSFERRING
  let isTransfer = $derived($transactionForm.type === "transfer");
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<div>
  <header class="space-y-2">
    <h1
      class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl"
    >
      Transactions
    </h1>
  </header>

  <div
    class={cn([
      "grid mb-20",
      "gap-12",
      "mt-12",
      !sidebar.isMobile && sidebar.open
        ? "max-xl:grid-cols-1 xl:grid-cols-2"
        : "grid-cols-2 max-lg:grid-cols-1",
    ])}
  >
    <section class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-6">
        <!-- <h2 class="text-muted-foreground font-semibold">Add Transaction</h2> -->

        <Field.Set>
          <Field.Label for="">Transaction Type</Field.Label>
          <Field.Description
            >Select the type of this transaction.</Field.Description
          >
          <RadioGroup.Root
            bind:value={$transactionForm.type}
            class="grid grid-cols-3 gap-4"
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

        <p class="text-muted-foreground font-semibold">
          Fill the fields below.
        </p>

        {#if isTransfer}
          <TransferForm accountOptions={accounts} />
        {:else}
          <div class="w-full">
            <h2 class="text-foreground font-semibold mb-4 text-sm">
              Transaction Details
            </h2>
          </div>

          {#if $message}
            <p class="font-bold">{$message}</p>
          {/if}

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
                    </Field.Field>
                  </div>
                </Field.Group>

                <Field.Field>
                  <Field.Label for="category">Category</Field.Label>
                  <Select.Root
                    type="single"
                    bind:value={$transactionForm.category}
                    name="category"
                    {...$constraints.category}
                  >
                    <Select.Trigger>{categoryLabel}</Select.Trigger>
                    <Select.Content>
                      {#each categoryOptions as categoryOption (categoryOption.value)}
                        <Select.Item {...categoryOption} />
                      {/each}
                    </Select.Content>
                  </Select.Root>
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
                        bind:value={$transactionForm.account}
                        name="account"
                      >
                        <Select.Trigger>{accountLabel}</Select.Trigger>
                        <Select.Content>
                          {#each accounts as account (account.value)}
                            <Select.Item {...account} />
                          {/each}
                        </Select.Content>
                      </Select.Root>
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
                </Field.Field>
              </Field.Group>
            </Field.Set>
            <Field.Separator />
            <Field.Field orientation="responsive">
              <Button type="submit" class="max-w-xs mx-auto">Add</Button>
            </Field.Field>
          </form>
        {/if}

        <SuperDebug data={$transactionForm} />
      </div>
    </section>

    <section class="flex gap-12 flex-col">
      <div>
        <h2 class="mb-4 text-muted-foreground font-semibold">Transactions</h2>

        <TransactionList {transactions} />
      </div>
      <div>
        <h2 class="mb-4 text-muted-foreground font-semibold">Transfers</h2>
        <Dialog.Root>
          <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
            >Add Account</Dialog.Trigger
          >

          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add Account</Dialog.Title>
            </Dialog.Header>
            <div class="max-w-md w-full mx-auto">
              <form class="grid gap-4" action="?/addAccount" method="post">
                <Field.Group>
                  <Field.Field>
                    <Field.Label for="name">Account Name</Field.Label>
                    <Input
                      name="name"
                      bind:value={$accountForm.name}
                      {...$accountConstraints.name}
                    />
                  </Field.Field>
                  <Field.Field>
                    <Field.Label for="balance">Initial Balance</Field.Label>
                    <Input
                      type="number"
                      name="balance"
                      bind:value={$accountForm.balance}
                      {...$accountConstraints.balance}
                    />
                  </Field.Field>
                </Field.Group>

                <Dialog.Footer>
                  <Button type="submit" class="w-full">Save</Button>
                </Dialog.Footer>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Root>

        <TransactionList {transactions} />
      </div>
    </section>
  </div>
</div>
