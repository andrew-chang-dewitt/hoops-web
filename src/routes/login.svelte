<script context="module" lang="ts">
  import type { Input } from '$lib/session'

  export const load = async ({session}: Input) =>
    session.token ? { status: 302, redirect: '/' } : {}

</script>

<script lang="ts">
  import {session} from '$app/stores'
  import {goto} from '$app/navigation'

  import {login} from '$lib/api'
  import type {Token} from '$lib/api'

  let username = ''
  let password = ''

  const submit = () => {
    const success = (token: Token): void => {
      $session.token = token.access_token

      goto('/')
    }

    // submit given credentials to API for auth
    login({username, password}).then((res) => res.mapOk(success))

    // clear password field on failure
    password = ''
  }

</script>

<svelte:head>
  <title>Sign in | Hoops</title>
</svelte:head>

<div>
  <form on:submit|preventDefault={submit}>
    <label for="username">Username:</label>
    <input id="username" type="text" bind:value={username} />

    <label for="password">Username:</label>
    <input id="password" type="password" bind:value={password} />

    <button type="submit">Sign In</button>
  </form>
</div>
