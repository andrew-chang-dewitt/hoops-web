<script context="module" lang="ts">
  import type {Load} from '@sveltejs/kit'

  // check if user is logged in
  export const load: Load = async () => {
    return { status: 302, redirect: '/transactions' }
  }
</script>
