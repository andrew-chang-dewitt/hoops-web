<script lang="ts">
  import {session} from '$app/stores'
  import {Method} from '$lib/_utils'
  import {FetchError} from '$lib/api'

  const logout = async () => {
    await fetch('/auth/logout', {
      method: Method.POST,
    }).then(res => {
      if (!res.ok) throw new FetchError(`${res.status}: ${res.statusText}`)

      return res.json()
    })

    $session.token = ''
  }
</script>

<header>
  <h1>Hoops</h1>
  <nav>
    <ul>
      {#if $session.token}
      <li>
        <button on:click={logout}>Sign out</button>
      </li>
      {/if}
    </ul>
  </nav>
</header>

<slot></slot>
