<script context="module" lang="ts">
  import Input from '$lib/components/Input.svelte'
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async ({session}) =>
    session.token ? { status: 302, redirect: '/' } : {}
</script>

<script lang="ts">
  import {goto} from '$app/navigation'
  import {session} from '$app/stores'

  import {Method, ResponseError} from '$lib/_utils'

  import type {Token} from '$lib/models/token'

  let username = ''
  let password = ''
  let pendingSubmit = false
  let errorMessage = ''

  const onSuccess = (token: Token) => {
    // set page state as not submitting
    pendingSubmit = false

    // save token string to session
    $session.token = token.access_token

    // navigate to homepage
    goto('/')
  }

  const onFailure = (error: Error) => {
    // set page state as not submitting
    pendingSubmit = false

    errorMessage = error.message

    // clear password field on failure
    password = ''
  }

  const submit = async () => {
    // set page state as submitting
    pendingSubmit = true

    // clear error message
    errorMessage = ''

    const submitBody = JSON.stringify({ username, password })

    // submit given credentials to API for auth
    await fetch('/auth/login', {
      method: Method.POST,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: submitBody
    })
      .then(res => {
        if (res.ok) return res.json()

        throw new ResponseError(res.status, res.statusText, res)
      })
      .then(onSuccess)
      .catch(onFailure)
  }
</script>

<svelte:head>
  <title>Sign in | Hoops</title>
</svelte:head>

<div>
  <p class="ErrorMessage" class:display={errorMessage}>{errorMessage}</p>

  <form on:submit|preventDefault={submit}>
    <Input name="username" label="Username" bind:value={username} />

    <Input name="password" inputType="password" label="Password" bind:value={password} />

    <button type="submit" disabled={pendingSubmit}>Sign In</button>
  </form>

  <p>
    New to Hoops? <a href="/register">Register for an account</a>.
  </p>
</div>
