<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import '../app.css';

	onMount(() => {
		const token = localStorage.getItem('token');
		if (!token && window.location.pathname !== '/login') {
			goto('/login');
		}
	});

	let { children } = $props();

</script>

<div class="min-h-dvh bg-gray-50">
	<div class="p-6">
		{@render children?.()}
	</div>
</div>
