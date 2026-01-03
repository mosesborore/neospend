<script lang="ts">
  import type { PageProps } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import { resolve } from "$app/paths";

  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Item from "$lib/components/ui/item/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  let { data }: PageProps = $props();

  const getForm = () => data.loginForm;

  const { form, errors, message, delayed, enhance, constraints } =
    superForm(getForm());
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<main>
  <div class="flex justify-center items-center min-h-[70vh]">
    <Card.Root class="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Login</Card.Title>
        <Card.Description>Enter your details to login.</Card.Description>
        <Card.Action>
          <a
            class={buttonVariants({ variant: "link" })}
            href={resolve("/auth/register")}>Register</a
          >
        </Card.Action>
      </Card.Header>
      <Card.Content class="grid gap-y-8">
        {#if $message}
          <Item.Root variant="outline" size="sm" class="bg-muted">
            <Item.Content>
              <Item.Title class="text-muted-foreground">{$message}</Item.Title>
            </Item.Content>
          </Item.Root>
        {/if}

        <form method="POST" use:enhance>
          <div class="flex flex-col gap-6">
            <Field.Set>
              <Field.Group>
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
                    placeholder="••••••••"
                    bind:value={$form.password}
                    {...$constraints.password}
                  />
                  {#if $errors.password}
                    <Field.Description>{$errors.password}</Field.Description>
                  {/if}
                </Field.Field>
              </Field.Group>
            </Field.Set>
            <div class="mt-4">
              <Button variant="default" type="submit" class="w-full">
                Login
                {#if $delayed}
                  <Spinner />
                {/if}
              </Button>
            </div>
          </div>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
</main>
