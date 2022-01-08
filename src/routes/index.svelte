<script context="module" lang="ts">
  import type { Input } from '$lib/session'
  import { checkToken } from '$lib/auth'

  // check if user is logged in
  export const load = async ({session}: Input) => 
    checkToken( {
      token: session.token,
          // redirect to transactions page if successful
          // otherwise accept default failure result
      // success: { status: 302, redirect: `/transactions` }
    })
</script>

<span>
  <p>Home page</p>
</span>
