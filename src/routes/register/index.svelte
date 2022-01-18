<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async ({session}) => 
    session.token ? {status: 302, redirect: '/'} : {}
</script>

<script lang="ts">
  import {goto} from '$app/navigation'
  import {isFetchError, FetchError, User} from '$lib/api'

  import Input from '$lib/components/Input.svelte'

  let handle = ''
  let password = ''
  let fullName = ''
  let preferredName = ''

  let error: FetchError

  const submit = async () => {
    const response = await User.post({
      data: {handle, password, full_name: fullName, preferred_name: preferredName}
    })

    if (isFetchError(response)) {
      error = response
    }
    else {
      goto(`/register/welcome-${preferredName ? preferredName : fullName}`)
    }
  }
</script>

<div>
  {#if error}
    <p>{error.message}</p>
  {/if}

  <form on:submit|preventDefault={submit}>
    <Input name="preferredName" label="Preferred Name" bind:value={preferredName} />
    <Input name="fullName" label="Full Name" bind:value={fullName} />
    <Input name="handle" label="Handle" bind:value={handle} />
    <Input name="password" inputType="password" label="Password" bind:value={password} />

    <button type="submit">Submit</button>
  </form>
</div>
