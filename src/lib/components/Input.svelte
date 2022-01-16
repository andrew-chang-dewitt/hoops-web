<script lang="ts">
  export let name: string
  export let label: string
  export let value: string
  export let inputType: "text" | "password" = "text"
</script>

<label for={name}>{label}:</label>
{#if inputType === "text"}
  <input id={name} type="text" bind:value />
{:else if inputType === "password"}
  <input id={name} type="password" bind:value />
{/if}
