<script context="module" lang="ts">
  import { checkToken } from '$lib/auth'

  import type {Load} from '@sveltejs/kit'

  let token: string

  // check if user is logged in
  export const load: Load = async ({session}) => {
    token = session.token

    // redirect to transactions page if logged in
    return checkToken(token, { status: 302, redirect: '/transactions' })
  }
</script>

<span>
  <p>Home page</p>

  <p>token: {token}</p>
</span>
