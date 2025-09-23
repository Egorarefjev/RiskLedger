<script lang="ts">
    import { onMount } from 'svelte';
    import { goto, afterNavigate } from '$app/navigation';
    import { browser } from '$app/environment';
    import {getIMDG, getIMDGCount} from '../../lib/api/imdg';

    import Button from '../../lib/components/ui/Button.svelte';
    import Select from '../../lib/components/ui/Select.svelte';
    import ImdgTable from '../../lib/components/imdg/ImdgTable.svelte';
    import { IMDG_COLUMNS } from '../../lib/components/imdg/columns';
    import {encodeJsonBase64Url} from "$lib/utils/encoding";
    import Input from "$lib/components/ui/Input.svelte";

    const DEFAULT_PAGE = 1;
    const DEFAULT_PER_PAGE = 10;

    const QUERY = {
        PAGE: 'page',
        PER_PAGE: 'perPage',
        FILTER: 'filter',
    } as const;

    const PER_PAGE_OPTIONS = [10, 20, 50, 100].map((pageSize) => {
        return { label: String(pageSize), value: pageSize };
    });

    let page = DEFAULT_PAGE;
    let perPage: number = DEFAULT_PER_PAGE;
    let filter: [] | null = null;
    let unidInput = '';

    let items: any[] = [];
    let totalCount = 0;
    let isLoading = false;
    let errorMessage = '';

    function readQueryParams() {
        const searchParams = new URLSearchParams(location.search);
        page = Number(searchParams.get(QUERY.PAGE)) ? Number(searchParams.get(QUERY.PAGE)) : DEFAULT_PAGE;
        perPage = Number(searchParams.get(QUERY.PER_PAGE)) ? Number(searchParams.get(QUERY.PER_PAGE)) : DEFAULT_PER_PAGE;
        if (typeof searchParams.get(QUERY.FILTER) === 'string') {
            filter = searchParams.get(QUERY.FILTER).split(',')
        }
    }

    function buildQueryParams(): URLSearchParams {
        const params = new URLSearchParams();
        params.set(QUERY.PAGE, String(page));
        params.set(QUERY.PER_PAGE, String(perPage));
        if (filter !== null && filter !== undefined) {
            params.set(QUERY.FILTER, encodeJsonBase64Url(filter));
        }

        return params;
    }

    async function loadImdgList() {
        isLoading = true;
        errorMessage = '';

        try {
            const params = buildQueryParams();
            [items, totalCount] = await Promise.all([
                getIMDG(buildQueryParams()),
                getIMDGCount(buildQueryParams()),
            ]);
        } catch (error: any) {
            errorMessage = error?.message ?? 'Ошибка загрузки';
        } finally {
            isLoading = false;
        }
    }

    function updateQueryParams(next: { page?: number; perPage?: number, filter?: [] | null }) {
        const searchParams = new URLSearchParams(location.search);

        if (next.page != null) {
            searchParams.set(QUERY.PAGE, String(next.page));
        }
        if (next.perPage != null) {
            searchParams.set(QUERY.PER_PAGE, String(next.perPage));
        }

        if (next.filter !== null && next.filter !== undefined) {
            searchParams.set(QUERY.FILTER, String(next.filter));
        } else {
            searchParams.delete(QUERY.FILTER);
        }

        goto(`/imdg?${searchParams.toString()}`, { keepfocus: true, noscroll: true });
    }

    function handleNextPageClick() {
        if (!isLoading) {
            updateQueryParams({ page: page + 1 });
        }
    }

    function handlePrevPageClick() {
        if (!isLoading && page > 1) {
            updateQueryParams({ page: page - 1 });
        }
    }

    function handlePerPageChange(event) {
        const nextPerPage = Number(event.detail);
        if (Number.isFinite(nextPerPage) && nextPerPage > 0) {
            updateQueryParams({ page: 1, perPage: nextPerPage });
        }
    }

    function getMaxPage(): number {
        return Math.ceil(totalCount / perPage) || 1;
    }

    function handleApplyUnidFilter() {
        updateQueryParams({ filter: ['eq', 'unid', unidInput] });
    }

    function handleClearFilter() {
        filter = null;
        unidInput = '';
        updateQueryParams({ filter: null });

    }

    onMount(() => {
        if (!browser) return;

        const searchParams = new URLSearchParams(location.search);
        let hasChanges = false;

        if (!searchParams.get(QUERY.PAGE)) {
            searchParams.set(QUERY.PAGE, String(DEFAULT_PAGE));
            hasChanges = true;
        }
        if (!searchParams.get(QUERY.PER_PAGE)) {
            searchParams.set(QUERY.PER_PAGE, String(DEFAULT_PER_PAGE));
            hasChanges = true;
        }

        if (hasChanges) {
            goto(`/imdg?${searchParams.toString()}`, { replaceState: true, keepfocus: true, noscroll: true });
            return;
        }

        readQueryParams();
        loadImdgList();
    });

    afterNavigate(() => {
        if (!browser) return;
        readQueryParams();
        loadImdgList();
    });
</script>

<section class="space-y-4">
    <h1 class="font-semibold text-xl">IMDG</h1>

    <div class="flex items-center gap-4">
        <label class="flex items-center gap-2">
            <Input bind:value={unidInput} placeholder="Введите UN" />
            <Button on:click={handleApplyUnidFilter}>Применить</Button>
            <Button on:click={handleClearFilter}>Сбросить</Button>
        </label>
        <label class="flex items-center gap-2">
            <span class="text-sm text-gray-600">На странице:</span>
            <Select on:change={handlePerPageChange} bind:value={perPage} options={PER_PAGE_OPTIONS} disabled={isLoading} />
        </label>

        <div class="text-sm text-gray-600">
            {#if isLoading}Загрузка…{/if}
            {#if !isLoading}Всего: {totalCount}{/if}
        </div>
    </div>

    {#if errorMessage}
        <div class="text-red-600">{errorMessage}</div>
    {/if}

    <ImdgTable items={items} columns={IMDG_COLUMNS} loading={isLoading} />

    <div class="flex items-center gap-3 pt-2">
        <Button on:click={handlePrevPageClick} disabled={isLoading || page<=1}>Назад</Button>
        <span class="text-sm">Стр. {page}</span>
        <Button on:click={handleNextPageClick} disabled={isLoading || page >= getMaxPage()}>>Вперёд</Button>
    </div>
</section>

