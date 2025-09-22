<script>
	let { children } = $props();
	
	import '../app.css';

</script>

<div class="min-h-dvh flex items-center flex-nowrap bg-gray-50">
	<div class="border-r bg-white">

	</div>

	<div class="p-6">
		{@render children?.()}
	</div>
</div>
