<script lang="ts">
  import type { PageProps } from "./$types";
  import { superForm } from "sveltekit-superforms";

  import { Button } from "$lib/components/ui/button/index.js";
  // import { Label } from "$lib/components/ui/label/index.js";

  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  let { data }: PageProps = $props();

  const { form, errors, message, enhance, constraints } = superForm(data.form);
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<main>
  <div class="flex justify-center items-center min-h-[70vh]">
    <Card.Root class="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Create an account</Card.Title>
        <Card.Description
          >Enter your details below to create an account</Card.Description
        >
        <Card.Action>
          <Button variant="link">Login</Button>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        {#if $message}
          <p class="text-sm mb-2 text-center text-muted-foreground">
            {$message}
          </p>
        {/if}

        <form method="POST" use:enhance>
          <div class="flex flex-col gap-6">
            <div class="grid gap-2">
              <label for="email">Name</label>
              <Input
                id="name"
                type="text"
                name="name"
                bind:value={$form.name}
                placeholder="Enter your name"
                {...$constraints.name}
              />
              {#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
            </div>
            <div class="grid gap-2">
              <label for="email">Email</label>
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
                <label for="password">Password</label>
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
              <Button variant="default" type="submit" class="w-full"
                >Create Account</Button
              >
              <Button
                variant="secondary"
                class="w-full mt-2 bg-blue-700 text-white"
                >Create via Google</Button
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
