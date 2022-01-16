<script context="module" lang="ts">
  import { checkToken } from '$lib/auth';
  import type {Load} from '@sveltejs/kit'

  export const load: Load = async ({session}) =>
    checkToken(session.token)
</script>

<p>create a new account here</p>
