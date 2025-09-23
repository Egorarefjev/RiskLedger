<script lang="ts">
    import type { ImdgColumn } from './columns';
    export let item: any;
    export let columns: ImdgColumn[] = [];

    function getCellValue(key: string) {
        const value = item?.[key];
        return value === null || value === undefined || value === '' ? '-' : String(value);
    }
</script>

<tr>
    {#each columns as column}
        <td class="px-3 py-2 border-b border-gray-100 align-top whitespace-pre-wrap">{getCellValue(column.key)}</td>
    {/each}
</tr>
