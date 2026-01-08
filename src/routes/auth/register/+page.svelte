<script lang="ts">
  import type { PageProps } from "./$types";
  import { superForm } from "sveltekit-superforms";

  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import * as Item from "$lib/components/ui/item/index.js";

  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { resolve } from "$app/paths";

  let { data }: PageProps = $props();

  function getForm() {
    return data.form;
  }

  const { form, errors, message, enhance, delayed, constraints } =
    superForm(getForm());
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<main class="mt-8">
  <div class="flex justify-center items-center min-h-[80vh]">
    <Card.Root class="w-full max-w-md">
      <Card.Header>
        <Card.Title>Create an account</Card.Title>
        <Card.Description
          >Enter your details below to create an account</Card.Description
        >
        <Card.Action>
          <a
            class={buttonVariants({ variant: "link" })}
            href={resolve("/auth/login")}>Login</a
          >
        </Card.Action>
      </Card.Header>
      <Card.Content class="grid gap-y-8">
        {#if $message}
          <Item.Root variant="outline" size="sm">
            <Item.Content>
              <Item.Title class="text-muted-foreground">{$message}</Item.Title>
            </Item.Content>
          </Item.Root>
        {/if}

        <form method="POST" use:enhance>
          <Field.Set>
            <Field.Group>
              <Field.Field>
                <Field.Label for="name">Names</Field.Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  bind:value={$form.name}
                  placeholder="Enter your name"
                  {...$constraints.name}
                />
                {#if $errors.name}
                  <Field.Description>{$errors.name}</Field.Description>
                {/if}
              </Field.Field>
              <Field.Field>
                <Field.Label for="email">Email</Field.Label>

                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  bind:value={$form.email}
                  {...$constraints.email}
                />
                {#if $errors.email}
                  <Field.Description>{$errors.email}</Field.Description>
                {/if}
              </Field.Field>
              <Field.Field>
                <Field.Label for="password">Password</Field.Label>

                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  bind:value={$form.password}
                  {...$constraints.password}
                />
                {#if $errors.password}
                  <Field.Description>{$errors.password}</Field.Description>
                {/if}
              </Field.Field>
              <Field.Field>
                <Field.Label for="confirm">Confirm Password</Field.Label>

                <Input
                  id="confirm"
                  type="password"
                  name="confirm"
                  aria-invalid={$errors.confirm ? true : null}
                  placeholder="Enter password again to confirm"
                  bind:value={$form.confirm}
                  {...$constraints.confirm}
                />
                {#if $errors.confirm}
                  <Field.Description class="text-red-600"
                    >{$errors.confirm}</Field.Description
                  >
                {/if}
              </Field.Field>
            </Field.Group>
          </Field.Set>

          <div class="mt-4">
            <Button type="submit" class="w-full"
              >Create Account
              {#if $delayed}<Spinner />{/if}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
</main>
