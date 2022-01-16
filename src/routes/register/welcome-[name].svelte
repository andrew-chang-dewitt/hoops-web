<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  let userName: string = ''

  export const load: Load = async ({session, params}) => {
    userName = params.name

    return session.token ? {status: 302, redirect: '/'} : {}
  }
</script>

<svelte:head>
  <title>Hoops | Welcome, {userName}!</title>
</svelte:head>

<h2>Welcome, {userName}!</h2>

<p>
  I hope you'll enjoy saving money using Hoops as much as I've enjoyed creating 
  it! <a href="/login">Log in</a> with your new username & password to get 
  started, and please don't hesitate to let me know below if there's anything 
  that would make Hoops better for you.
</p>
