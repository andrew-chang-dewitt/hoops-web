<script context="module" lang="ts">
  import {checkToken} from '$lib/auth'
  import type {Load} from '@sveltejs/kit'

  export const load: Load = async ({session}) =>
    await checkToken({token: session.token})
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte'
</script>

<Header />

<slot></slot>
