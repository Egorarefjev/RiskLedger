<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/Button.svelte';
    import { logout } from "$lib/api/auth";

    async function handleLogout() {
        logout();
        goto('/login');
    }

    function goToTable() {
        goto('/imdg');
    }

</script>

<div class="flex items-center justify-between mb-6">
    <h1 class="text-xl font-semibold">Главная</h1>
    <div class="flex gap-2">
        <Button on:click={goToTable}>К таблице IMDG</Button>
        <Button on:click={handleLogout} >Выйти</Button>
    </div>
</div>

