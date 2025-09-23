<script lang="ts">
    export let value: string | number;
    export let options: { label: string; value: string | number }[] = [];
    export let disabled = false;
</script>

<select
        bind:value
        {disabled}
        on:change
        on:input
        class="px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
>
    {#each options as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>
