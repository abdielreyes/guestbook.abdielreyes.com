<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.svg';
	import MatrixBackground from '$lib/components/matrix-background/matrix-background.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<MatrixBackground />

<!-- CRT scanline overlay -->
<div
	class="pointer-events-none fixed inset-0 z-50"
	style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px);"
></div>

{@render children?.()}
