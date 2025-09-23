<script lang="ts">
    export let disabled = false;
    export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
        {type}
        {disabled}
        on:click
        class="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
>
    <slot />
</button>
