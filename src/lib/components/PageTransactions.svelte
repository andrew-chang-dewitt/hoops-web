<script lang="ts">
  // internal deps
  import {isFetchError, FetchError} from '$lib/api'

  // type deps
  import type {AccountOut} from '$lib/models/account'
  import type {TransactionOut} from '$lib/models/transaction'

  // component deps
  import AccountsMenu from './AccountsMenu.svelte'
  import TransactionList from './TransactionList.svelte'

  // props
  export let accounts: AccountOut[] | FetchError
  export let transactions: TransactionOut[] | FetchError
</script>

{#if isFetchError(accounts)}
  <div>{accounts}</div>
{:else}
  <AccountsMenu { accounts } />
{/if}

{#if isFetchError(transactions)}
  <div>{transactions}</div>
{:else}
  <TransactionList { transactions } />
{/if}
