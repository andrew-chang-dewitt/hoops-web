<script lang="ts">
  // type deps
  import type {TransactionOut} from '$lib/models/transaction'

  // props
  export let transactions: TransactionOut[]
</script>

<h3>Transactions</h3>
<ul>
  {#each transactions as transaction}
    <li>
      {transaction}
    </li>
  {/each}
</ul>
