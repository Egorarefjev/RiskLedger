<script lang="ts">
    export let value = '';
    export let placeholder = '';
    export let type = 'text';
    export let disabled = false;
</script>

<input
        class="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
        bind:value
        {placeholder}
        {type}
        {disabled}
/>
