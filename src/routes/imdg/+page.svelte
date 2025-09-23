<script lang="ts">
    import { onMount } from 'svelte';
    import { goto, afterNavigate } from '$app/navigation';
    import { browser } from '$app/environment';
    import { getIMDG } from '../../lib/api/imdg';
    import { encodeJsonBase64Url } from '../../lib/utils/encoding';

    const DEFAULT_PAGE = 1;
    const DEFAULT_PER_PAGE = 10;
    const PER_PAGE_OPTIONS = [10, 20, 50, 100];

    let page = DEFAULT_PAGE;
    let perPage = DEFAULT_PER_PAGE;

    let rows: any[] = [];
    let total = 0;
    let loading = false;
    let errorMsg = '';

    let classFilter = '';
    let unFilter = '';

    function parsePositiveInt(v: string | null, fallback: number) {
        const n = Number(v);
        return Number.isFinite(n) && n > 0 ? n : fallback;
    }

    function readQuery() {
        const sp = new URLSearchParams(location.search);
        page = parsePositiveInt(sp.get('page'), DEFAULT_PAGE);
        perPage = parsePositiveInt(sp.get('perPage'), DEFAULT_PER_PAGE);
        classFilter = sp.get('class') ?? '';
        unFilter = sp.get('un') ?? '';
    }

    function buildQuery(): URLSearchParams {
        const qs = new URLSearchParams();
        qs.set('page', String(page));
        qs.set('perPage', String(perPage));
        const conditions: any[] = [];
        if (classFilter.trim()) conditions.push(['like', 'class', `%${classFilter.trim()}%`]);
        if (unFilter.trim()) conditions.push(['like', 'un_number', `%${unFilter.trim()}%`]);
        if (conditions.length) {
            const filterAst = conditions.length > 1 ? ['and', ...conditions] : conditions[0];
            qs.set('filter', encodeJsonBase64Url(filterAst));
        }
        return qs;
    }

    async function loadData() {
        if (!browser) return;
        loading = true;
        errorMsg = '';
        try {
            const res = await getIMDG(buildQuery());
            const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
            const meta = res?.meta ?? {};
            rows = data;
            total = Number(meta.total ?? data.length);
        } catch (e: any) {
            errorMsg = e?.message ?? 'Ошибка загрузки';
        } finally {
            loading = false;
        }
    }

    function updateQuery(next: { page?: number; perPage?: number; classFilter?: string; unFilter?: string }) {
        const sp = new URLSearchParams(location.search);
        if (next.page != null) sp.set('page', String(next.page));
        if (next.perPage != null) sp.set('perPage', String(next.perPage));
        if (next.classFilter != null) sp.set('class', next.classFilter);
        if (next.unFilter != null) sp.set('un', next.unFilter);
        goto(`/imdg?${sp.toString()}`, { keepfocus: true, noscroll: true });
    }

    function onNextPage() { if (!loading) updateQuery({ page: page + 1 }); }
    function onPrevPage() { if (!loading && page > 1) updateQuery({ page: page - 1 }); }
    function onPerPageChange(e: Event) {
        const v = Number((e.target as HTMLSelectElement).value);
        if (Number.isFinite(v) && v > 0) updateQuery({ page: 1, perPage: v });
    }
    function onFiltersApply() {
        updateQuery({ page: 1, classFilter, unFilter });
    }
    function onFiltersReset() {
        classFilter = '';
        unFilter = '';
        updateQuery({ page: 1, classFilter, unFilter });
    }

    onMount(() => {
        if (!browser) return;
        const sp = new URLSearchParams(location.search);
        let changed = false;
        if (!sp.get('page')) { sp.set('page', String(DEFAULT_PAGE)); changed = true; }
        if (!sp.get('perPage')) { sp.set('perPage', String(DEFAULT_PER_PAGE)); changed = true; }
        if (changed) {
            goto(`/imdg?${sp.toString()}`, { replaceState: true, keepfocus: true, noscroll: true });
            return;
        }
        readQuery();
        loadData();
    });

    afterNavigate(() => {
        if (!browser) return;
        readQuery();
        loadData();
    });
</script>

<h1 style="font-weight:600; font-size:20px; margin:8px 0 12px;">IMDG</h1>

<div style="display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; margin-bottom:12px;">
    <label style="display:flex; flex-direction:column; gap:6px;">
        <span>Класс</span>
        <input bind:value={classFilter} placeholder="Напр. 3" />
    </label>

    <label style="display:flex; flex-direction:column; gap:6px;">
        <span>UN</span>
        <input bind:value={unFilter} placeholder="Напр. 1203" />
    </label>

    <button on:click={onFiltersApply} disabled={loading}>Применить</button>
    <button on:click={onFiltersReset} disabled={loading}>Сбросить</button>

    <div style="margin-left:auto; display:flex; gap:12px; align-items:center;">
        <label style="display:flex; gap:6px; align-items:center;">
            <span>На странице:</span>
            <select on:change={onPerPageChange} bind:value={perPage} disabled={loading}>
                {#each PER_PAGE_OPTIONS as opt}
                    <option value={opt}>{opt}</option>
                {/each}
            </select>
        </label>

        <div style="opacity:.7">
            {#if loading}Загрузка…{/if}
            {#if !loading}Всего: {total}{/if}
        </div>
    </div>
</div>

{#if errorMsg}
    <div style="color:#b00020; margin-bottom:12px;">{errorMsg}</div>
{/if}

<div style="overflow:auto; border:1px solid #efefef; border-radius:8px;">
    <table style="border-collapse:separate; border-spacing:0; width:100%; font-size:14px;">
        <thead>
        <tr style="background:#fafafa; text-align:left;">
            <th style="padding:10px; font-weight:600;">Наименование</th>
            <th style="padding:10px; font-weight:600;">Класс</th>
            <th style="padding:10px; font-weight:600;">UN</th>
        </tr>
        </thead>
        <tbody>
        {#if rows.length === 0 && !loading}
            <tr><td colspan="3" style="padding:10px; color:#777;">Ничего не найдено</td></tr>
        {:else}
            {#each rows as row (row?.id ?? `${row?.un_number}-${row?.name}`)}
                <tr>
                    <td style="padding:10px; border-bottom:1px solid #f1f1f1;">{row?.name ?? '-'}</td>
                    <td style="padding:10px; border-bottom:1px solid #f1f1f1;">{row?.class ?? '-'}</td>
                    <td style="padding:10px; border-bottom:1px solid #f1f1f1;">{row?.un_number ?? '-'}</td>
                </tr>
            {/each}
        {/if}
        </tbody>ё
    </table>
</div>

<div class="pager" style="display:flex; gap:8px; align-items:center; margin-top:12px;">
    <button on:click={onPrevPage} disabled={loading || page<=1}>Назад</button>
    <span>Стр. {page}</span>
    <button on:click={onNextPage} disabled={loading}>Вперёд</button>
</div>

