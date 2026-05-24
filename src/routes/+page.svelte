<script lang="ts">
	import { onMount } from 'svelte';
	import MessageForm from '$lib/components/messages/new-message-form/message-form.svelte';
	import ThemeModeButton from '$lib/components/theme-mode-button/theme-mode.svelte';
	import MessageList from '$lib/components/messages/message-list/message-list.svelte';
	import pb from '$lib/pocketbase';

	let messages = $state<App.Message[]>([]);

	onMount(async () => {
		messages = await getMessages();
	});

	async function getMessages(): Promise<App.Message[]> {
		const response = await pb.collection('messages').getFullList({
			expand: 'comments',
			sort: '-created'
		});
		return response as unknown as App.Message[];
	}

	async function refresh() {
		messages = await getMessages();
	}
</script>

<div class="max-w-2xl mx-auto my-8 px-4">
	<!-- Frosted glass content card -->
	<div
		class="flex flex-col gap-5 bg-black/80 backdrop-blur-sm border border-white/10 rounded-sm px-6 py-6"
	>
		<!-- ── header ─────────────────────────────────────────── -->
		<header class="border-b border-white/10 pb-5 text-center">
			<h1
				class="text-white font-mono text-3xl font-light tracking-[0.25em] uppercase"
			>
				guestbook
			</h1>
			<p class="font-mono text-xs text-white/30 tracking-widest mt-1">
				abdielreyes.com
			</p>
		</header>

		<!-- ── intro blurb ─────────────────────────────────────── -->
		<p
			class="font-mono text-sm text-white/70 leading-relaxed"
			style="font-family: 'Share Tech Mono', monospace;"
		>
			<span class="text-white/40">&gt;</span> Hello y'all! 👋 This is a little space where you can
			drop a message, say hi, or just leave something else. Your words will make this page feel more
			alive — so don't be shy, sign my guestbook before you go!<br />
			<span class="text-white/40 mt-1 block">&gt; -- Abdiel</span>
		</p>

		<!-- ── new message form ────────────────────────────────── -->
		<MessageForm {refresh} />

		<!-- ── message list ────────────────────────────────────── -->
		<MessageList {messages} {refresh} />

		<!-- ── footer ─────────────────────────────────────────── -->
		<footer class="border-t border-white/10 pt-4 mt-2">
			<div class="font-mono text-white/20 text-xs tracking-widest text-center select-none mb-2">
				{'─'.repeat(36)}
			</div>
			<p
				class="text-xs text-white/30 text-center font-mono"
				style="font-family: 'Share Tech Mono', monospace;"
			>
				Powered by Svelte &amp; PocketBase
			</p>
			<p
				class="text-xs text-white/30 text-center font-mono mt-0.5"
				style="font-family: 'Share Tech Mono', monospace;"
			>
				Made with ❤️ by
				<a href="https://abdielreyes.com" class="text-white/50 hover:text-white/80 underline transition-colors">
					Abdiel Reyes
				</a>
				· Source on
				<a
					href="https://github.com/abdielreyes/guestbook.abdielreyes.com"
					class="text-white/50 hover:text-white/80 underline transition-colors"
					target="_blank"
					rel="noopener noreferrer"
				>
					GitHub
				</a>
			</p>
		</footer>
	</div>
</div>

<ThemeModeButton />
