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
		const messages = response as unknown as App.Message[];
		return messages;
	}

	//on event refreshMessages getmessages again
	async function refresh() {
		messages = await getMessages();
	}
</script>

<div class="flex flex-col gap-4 max-w-2xl mx-auto my-8 px-4">
	<div>
		<h1 class="text-2xl font-bold">GuestBook</h1>
		<p>
			Hello y'all! 👋 This is a little space where you can drop a message, say hi, or just leave
			something else. Your words will make this page feel more alive — so don't be shy, sign my
			guestbook before you go! <br />
			- Abdiel
		</p>
	</div>
	<MessageForm {refresh} />
	<MessageList {messages} {refresh} />
	<div class="text-sm text-gray-500 dark:text-gray-400 text-center mt-8">
		<p>Powered by Svelte and PocketBase</p>
		<p>
			Made with ❤️ by <a href="https://abdielreyes.com" class="underline">Abdiel Reyes</a>. View the
			source code on
			<a
				href="https://github.com/abdielreyes/guestbook.abdielreyes.com"
				class="underline"
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub
			</a>.
		</p>
	</div>
</div>

<ThemeModeButton />
