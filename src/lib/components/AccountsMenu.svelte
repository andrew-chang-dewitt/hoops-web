<script lang="ts">
  // type deps
  import type {AccountOut} from '$lib/models/account'

  // props
  export let accounts: AccountOut[]
</script>

<h3>Accounts</h3>
<ul>
  {#each accounts as account}
    <li>
      {account}
    </li>
  {/each}
</ul>
