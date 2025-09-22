<script lang="ts">
    import { login } from '$lib/api/auth';
    import { goto } from '$app/navigation';

    let username = '';
    let password = '';
    let error: string | null = null;

    async function handleSubmit() {
        try {
            const res = await login(username, password);
            localStorage.setItem('token', res.access.token);
            goto('/');
        } catch (e: any) {
            error = e.message || 'Ошибка входа';
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 w-64 mx-auto mt-20">
    <input
            type="text"
            placeholder="Логин"
            bind:value={username}
            class="border p-2 rounded"
            required
    />
    <input
            type="password"
            placeholder="Пароль"
            bind:value={password}
            class="border p-2 rounded"
            required
    />
    <button type="submit" class="bg-blue-600 text-white p-2 rounded">
        Войти
    </button>

    {#if error}
        <p class="text-red-500">{error}</p>
    {/if}
</form>
