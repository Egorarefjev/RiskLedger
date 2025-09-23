<script lang="ts">
    import ImdgRow from './ImdgRow.svelte';
    import type { ImdgColumn } from './columns';
    export let items: any[] = [];
    export let columns: ImdgColumn[] = [];
    export let loading = false;
</script>

<div class="overflow-auto border border-gray-200 rounded-lg">
    <table class="w-full border-separate border-spacing-0 text-sm">
        <thead>
        <tr class="bg-gray-50 text-left">
            {#each columns as col}
                <th class="px-3 py-2 font-semibold">{col.label}</th>
            {/each}
        </tr>
        </thead>
        <tbody>
        {#if items.length === 0 && !loading}
            <tr>
                <td class="px-3 py-3 text-gray-500" colspan={columns.length}>Ничего не найдено</td>
            </tr>
        {:else}
            {#each items as item (item?.id ?? item?.uuid ?? `${item?.unid}-${item?.name}`)}
                <ImdgRow {item} {columns} />
            {/each}
        {/if}
        </tbody>
    </table>
</div>
