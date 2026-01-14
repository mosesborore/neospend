<script lang="ts">
  import MoreVertical from "@lucide/svelte/icons/more-vertical";
  import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import Pencil from "@lucide/svelte/icons/pencil";
  import { Spinner } from "$lib/components/ui/spinner/index.js";

  import * as Item from "$lib/components/ui/item/index.js";
  import type { PageProps } from "./$types";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  import { superForm } from "sveltekit-superforms";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { formatAmount } from "$lib/utils";
  import { invalidate } from "$app/navigation";
  import { Tween } from "svelte/motion";
  import { linear } from "svelte/easing";

  let { data }: PageProps = $props();

  const totalTween = new Tween(0, {
    duration: 1000,
    delay: 100,
    easing: linear,
  });

  $effect(() => {
    // update when total changes
    totalTween.target = total;
  });

  let total = $derived(
    data.accounts.reduce((p, account) => (p += account.balance), 0)
  );

  const getAccountForm = () => data.form;
  let { form, constraints, message, errors, enhance, reset, delayed } =
    superForm(getAccountForm(), {
      resetForm: true,
      onError: ({ result }) => {
        console.log("Something went wrong: ", result);
      },
      onUpdated: () => {
        console.log("Form submitted.");
      },
    });

  async function handleDelete(id: string) {
    const a = confirm(
      "If you delete this account. You also delete transactions associated with it."
    );

    if (!a) {
      return;
    }

    const resp = await fetch("/api/accounts", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "content-type": "application/json",
      },
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.error) {
        console.error(data.error);
      } else {
        console.log(data.message);
        invalidate("app:accounts");
      }
    } else {
      console.error(data);
    }
  }
</script>

<svelte:head>
  <title>Accounts</title>
</svelte:head>

<div>
  <header class="space-y-2">
    <h1
      class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl"
    >
      Accounts
    </h1>
    <p class="text-muted-foreground text-sm">
      All of your accounts are listed here.
    </p>
  </header>

  <section class="my-6">
    <Dialog.Root>
      <Dialog.Trigger class={buttonVariants({ variant: "default" })}
        >Add New Account</Dialog.Trigger
      >

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add New Account</Dialog.Title>
        </Dialog.Header>
        <div class="max-w-md w-full mx-auto grid gap-4">
          {#if $message}
            <Item.Root variant="outline" size="sm">
              <Item.Media>
                <BadgeCheckIcon class="size-5" />
              </Item.Media>
              <Item.Content>
                <Item.Title>{$message}</Item.Title>
              </Item.Content>
            </Item.Root>
          {/if}
          <form
            class="grid gap-4"
            action="?/addAccount"
            method="post"
            use:enhance
          >
            <Field.Group>
              <Field.Field>
                <Field.Label for="name">Account Name</Field.Label>
                <Input
                  name="name"
                  bind:value={$form.name}
                  {...$constraints.name}
                />
                <Field.Description>{$errors.name}</Field.Description>
              </Field.Field>
              <Field.Field>
                <Field.Label for="balance">Initial Balance</Field.Label>
                <Input
                  type="number"
                  name="balance"
                  bind:value={$form.balance}
                  {...$constraints.balance}
                />
                <Field.Description>{$errors.name}</Field.Description>
              </Field.Field>
            </Field.Group>

            <Dialog.Footer>
              <Button type="submit" class="w-full">
                Save
                {#if $delayed}
                  <Spinner />
                {/if}
              </Button>
            </Dialog.Footer>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </section>

  <section class="max-w-xl mx-auto p-4">
    <div id="accounts" class="grid gap-y-4">
      {#if !data.accounts.length}
        <p class="text-muted-foreground text-center">No accounts to display.</p>
      {:else}
        <div id="accountTotalItem">
          <Item.Root variant="outline" size="sm" class="bg-muted/50">
            <Item.Media>
              <BadgeCheckIcon class="size-5" />
            </Item.Media>
            <Item.Content>
              <Item.Title>
                All Accounts Total: {formatAmount(totalTween.current)}
              </Item.Title>
            </Item.Content>
          </Item.Root>
        </div>

        {#each data.accounts as account}
          <Item.Root variant="outline">
            <Item.Content>
              <Item.Title>{account.name}</Item.Title>
              <Item.Description
                >Balance: {formatAmount(account.balance)}</Item.Description
              >
            </Item.Content>
            <Item.Actions>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  {#snippet child({ props })}
                    <Button variant="ghost" size="icon" {...props}>
                      <MoreVertical />
                    </Button>
                  {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item>
                      <Pencil /> Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onclick={() => handleDelete(account.id)}>
                      <Trash2 /> Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Item.Actions>
          </Item.Root>
        {/each}
      {/if}
    </div>
  </section>
</div>
