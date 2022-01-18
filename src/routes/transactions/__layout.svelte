<script context="module" lang="ts">
  // internal deps
  import { Account, Transaction } from '$lib/api'
  import { checkToken } from '$lib/auth';

  // type deps
  import type {Load} from '@sveltejs/kit'

  // LOAD FN
  export const load: Load = async ({fetch, params, session}) => {
    // CONSTANTS
    const token = session.token

    // check token validity
    const checkTokenResponse = await checkToken({token})

    // short-circuit redirect on invalid token
    if (checkTokenResponse.status === 302) return checkTokenResponse

    // load data for SSR
    const transactions = params.account_id
      ? await Transaction.get({token}, {account_id: params.account_id}, fetch)
      : await Transaction.get({token}, {}, fetch)
    const accounts = await Account.get({token}, fetch)

    // pass accounts & transactions to stuff for layout to handle
    return {
      props: {accounts, transactions}
    }
  }
</script>

<script lang="ts">
  // type deps
  import type { FetchError } from '$lib/api';
  import type { TransactionOut } from '$lib/models/transaction';
  import type { AccountOut } from '$lib/models/account';

  // component deps
  import PageTransactions from '$lib/components/PageTransactions.svelte'

  // PROPS
  export let transactions: TransactionOut[] | FetchError
  export let accounts: AccountOut[] | FetchError

</script>

<PageTransactions { accounts } { transactions } />
