<script lang="ts">
  import type { PageProps } from "./$types";
  import { superForm } from "sveltekit-superforms";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";

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
        <Card.Description>Enter your details login.</Card.Description>
        <Card.Action>
          <a href="/auth/register">Register</a>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        {#if $message}
          <p class="text-xs mb-2 text-center">
            {$message}
          </p>
        {/if}

        <form method="POST" use:enhance action="?/login">
          <div class="flex flex-col gap-6">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                bind:value={$form.email}
                placeholder="m@example.com"
                {...$constraints.email}
              />
              {#if $errors.email}<span class="invalid">{$errors.email}</span
                >{/if}
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                bind:value={$form.password}
                {...$constraints.password}
              />
            </div>
            <div class="mt-4">
              <Button variant="default" type="submit" class="w-full">
                Login
                {#if $delayed}
                  <Spinner />
                {/if}
              </Button>
              <Button
                variant="secondary"
                class="w-full mt-2 bg-blue-700 text-white"
                >Login with Google</Button
              >
            </div>
          </div>
        </form>
      </Card.Content>
      <!-- <Card.Footer class="flex-col gap-2">
        <Button variant="default" type="submit" class="w-full"
          >Create Account</Button
        >
        <Button variant="secondary" class="w-full">Create with Google</Button>
      </Card.Footer> -->
    </Card.Root>
  </div>
</main>
