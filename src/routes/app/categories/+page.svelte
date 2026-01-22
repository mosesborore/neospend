<script lang="ts">
  import MoreVertical from "@lucide/svelte/icons/more-vertical";
  import { Spinner } from "$lib/components/ui/spinner/index.js";

  import * as Item from "$lib/components/ui/item/index.js";
  import type { PageProps } from "./$types";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import toast from "svelte-french-toast";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import Pencil from "@lucide/svelte/icons/pencil";

  import { superForm } from "sveltekit-superforms";
  import { cn } from "$lib/utils";
  import type { CategoryType } from "$lib/types";

  let { data }: PageProps = $props();

  const getForm = () => data.form;

  let { form, constraints, errors, enhance, delayed } = superForm(getForm(), {
    resetForm: true,
    onError: ({ result }) => {
      toast.error("Unable to add category.");
      console.log("Something went wrong: ", result);
    },
    onUpdated: ({ form }) => {
      if (form.valid && form.message?.toastMessage) {
        toast.success(form.message.toastMessage);
      } else {
        toast.error(form.message.toastMessage);
      }
    },
  });

  const getEditForm = () => data.editForm;
  let editDialogOpen = $state(false);

  let {
    form: editForm,
    constraints: editConstraints,
    errors: editErrors,
    enhance: editEnhance,
    reset: editReset,
    delayed: editDelayed,
  } = superForm(getEditForm(), {
    resetForm: true,
    onError: ({ result }) => {
      toast.error("Unable to update category.");
      console.log("Something went wrong: ", result);
    },
    onUpdated: ({ form }) => {
      if (form.valid && form.message?.toastMessage) {
        toast.success(form.message.toastMessage);
        closeEditDialog();
      } else {
        toast.error(form.message.toastMessage);
      }
    },
  });

  function openEditDialog(category: CategoryType) {
    editDialogOpen = true;
    $editForm = category;
  }

  function closeEditDialog() {
    editDialogOpen = false;
    editReset();
  }

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

  const transactionTypeLabel = $derived(
    transactionTypes.find((t) => t.value === $form.type)?.label ??
      "Choose transaction type",
  );
  const editTransactionTypeLabel = $derived(
    transactionTypes.find((t) => t.value === $editForm.type)?.label ??
      "Choose transaction type",
  );
</script>

<svelte:head>
  <title>Categories</title>
</svelte:head>
<div>
  <header class="flex justify-between items-center">
    <div class="spacing-y-4">
      <h1 class="scroll-m-20 text-xl font-semibold sm:text-3xl xl:text-4xl">
        Categories
      </h1>
      <span class="text-muted-foreground"> Create and manage categories </span>
    </div>
  </header>

  <section class="my-6">
    <div id="addForm">
      <Dialog.Root>
        <Dialog.Trigger class={buttonVariants({ variant: "default" })}
          >Add New Category</Dialog.Trigger
        >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Add New Category</Dialog.Title>
          </Dialog.Header>
          <div class="max-w-md w-full mx-auto grid gap-4">
            <div>
              <form
                class="grid gap-4"
                method="post"
                action="?/addCategory"
                use:enhance
              >
                <Field.Group>
                  <Field.Field>
                    <Field.Label for="name">Category Name</Field.Label>
                    <Input
                      name="name"
                      bind:value={$form.name}
                      {...$constraints.name}
                    />
                    <Field.Description>{$errors.name}</Field.Description>
                  </Field.Field>
                  <Field.Group>
                    <div class="grid gap-6">
                      <Field.Field>
                        <Field.Label for="type">Transaction Type</Field.Label>
                        <Select.Root
                          type="single"
                          bind:value={$form.type}
                          name="type"
                        >
                          <Select.Trigger>{transactionTypeLabel}</Select.Trigger
                          >
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
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
    <div id="editFormDialog">
      <Dialog.Root bind:open={editDialogOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Edit Category: {$editForm.name}</Dialog.Title>
          </Dialog.Header>
          <div class="max-w-md w-full mx-auto grid gap-4">
            <div>
              <form
                class="grid gap-4"
                method="post"
                action="?/updateCategory"
                use:editEnhance
              >
                <input type="hidden" name="id" bind:value={$editForm.id} />

                <Field.Group>
                  <Field.Field>
                    <Field.Label for="name">Category Name</Field.Label>
                    <Input
                      name="name"
                      bind:value={$editForm.name}
                      {...$editConstraints.name}
                    />
                    <Field.Description>{$editErrors.name}</Field.Description>
                  </Field.Field>
                  <Field.Group>
                    <div class="grid gap-6">
                      <Field.Field>
                        <Field.Label for="type">Transaction Type</Field.Label>
                        <Select.Root
                          type="single"
                          bind:value={$editForm.type}
                          disabled
                          name="type"
                        >
                          <Select.Trigger
                            >{editTransactionTypeLabel}</Select.Trigger
                          >
                          <Select.Content>
                            {#each transactionTypes as transactionType (transactionType.value)}
                              <Select.Item {...transactionType} />
                            {/each}
                          </Select.Content>
                        </Select.Root>
                        {#if $errors.type}
                          <Field.Description
                            >{$editErrors.type}</Field.Description
                          >
                        {/if}
                      </Field.Field>
                    </div>
                  </Field.Group>
                </Field.Group>

                <Dialog.Footer class="flex gap-4 justify-between items-center">
                  <Button
                    class="flex-1"
                    type="button"
                    variant="outline"
                    onclick={closeEditDialog}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" class="flex-1">
                    Update
                    {#if $editDelayed}
                      <Spinner />
                    {/if}
                  </Button>
                </Dialog.Footer>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </section>

  <section class={cn(["mx-auto p-4 grid gap-8", "lg:grid-cols-2"])}>
    <div id="expenseCategories">
      {#if !data.expenseCategories.length}
        <p class="text-muted-foreground text-center">
          No Expense Categories to display.
        </p>
      {:else}
        <h2 class="font-semibold mb-4">Expense Categories</h2>

        <div class="grid gap-y-4">
          {#each data.expenseCategories as category}
            <Item.Root variant="outline" size="sm">
              <Item.Content>
                <Item.Title>{category.name}</Item.Title>
              </Item.Content>
              <Item.Actions>
                {@render itemDropdownActions(category)}
              </Item.Actions>
            </Item.Root>
          {/each}
        </div>
      {/if}
    </div>
    <div id="incomeCategories">
      {#if !data.incomeCategories.length}
        <p class="text-muted-foreground text-center">
          No Income Categories to display.
        </p>
      {:else}
        <h2 class="font-semibold mb-4">Income Categories</h2>

        <div class="grid gap-y-4">
          {#each data.incomeCategories as category}
            <Item.Root variant="outline" size="sm">
              <Item.Content>
                <Item.Title>{category.name}</Item.Title>
              </Item.Content>
              <Item.Actions>
                {@render itemDropdownActions(category)}
              </Item.Actions>
            </Item.Root>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</div>

{#snippet itemDropdownActions(category: CategoryType)}
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
        <DropdownMenu.Item onclick={() => openEditDialog(category)}>
          <Pencil /> Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Trash2 /> Delete
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{/snippet}
