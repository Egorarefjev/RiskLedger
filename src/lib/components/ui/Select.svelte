<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value: string | number;
    export let options: { label: string; value: string | number }[] = [];
    export let disabled = false;

    $: stringValue = typeof value === 'number' ? String(value) : value;

    function onChange(e: Event) {
        dispatch('change', e?.target?.value);
    }
</script>

<select
        bind:value={stringValue}
        {disabled}
        on:change={onChange}
        class="px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
>
    {#each options as option}
        <option value={String(option.value)}>{option.label}</option>
    {/each}
</select>

