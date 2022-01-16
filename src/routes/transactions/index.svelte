<script context="module" lang="ts">
  import {isFetchError, Transaction, Account} from '$lib/api'
  import { checkToken } from '$lib/auth';
  import type {Load} from '@sveltejs/kit'

  export const load: Load = async ({session}) => {
    const token = session.token
    const checkTokenResponse = await checkToken(token)

    // short-circuit load & redirect if token invalid
    if (checkTokenResponse.status === 302) return checkTokenResponse

    // otherwise get transactions from api
    const transactions = await Transaction.get({token})
      .then(res => {
        if (isFetchError(res)) throw res

        return res
      })

    // if no transactions, check if user has any accounts
    if (transactions.length === 0) {
      const accounts = await Account.get({token})
        .then(res => {
          if (isFetchError(res)) throw res

          return res
        })

      // if no accounts either, redirect to account creation page
      if (accounts.length === 0) return {
        status: 302,
        redirect: '/account/new'
      }
    }

    // otherwise render empty transaction list
    return {}
  }
</script>
