<script lang="ts">
    import { onMount } from 'svelte';
    import { getIMDG } from "$lib/api/imdg";

    onMount(async () => {
        try {
            const data = await getIMDG();
            console.log(data);
        } catch (e) {
            console.log(e)
        }
    })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
