<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import pb from '$lib/pocketbase';

	const MAX_LENGTH = 280;

	let { refresh } = $props<{ refresh: () => void }>();
	let newMessage = $state('');
	let error = $state('');

	let remaining = $derived(MAX_LENGTH - newMessage.length);
	let isOverLimit = $derived(newMessage.length > MAX_LENGTH);
	let showCounter = $derived(newMessage.length >= MAX_LENGTH - 40);

	async function sendMessage() {
		error = '';

		if (!newMessage.trim()) return;

		// Backend guard — rejects even if maxlength was bypassed
		if (newMessage.length > MAX_LENGTH) {
			error = `Message must be ${MAX_LENGTH} characters or fewer.`;
			return;
		}

		const message = {
			body: newMessage.trim(),
			active: true,
			author: window.navigator.userAgent,
			created: new Date().toISOString()
		};

		const response = await pb.collection('messages').create(message);
		if (!response) {
			console.error('Failed to send message');
			return;
		}
		newMessage = '';
		refresh();
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>(what's the story) morning glory?</Card.Title>
	</Card.Header>

	<Card.Content>
		<div class="flex flex-col gap-1 px-4 pt-2">
			<textarea
				placeholder="Type your message here..."
				bind:value={newMessage}
				maxlength={MAX_LENGTH}
				rows={3}
				class="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
			></textarea>

			<div class="flex items-center justify-between px-1">
				{#if error}
					<p class="text-xs text-destructive">{error}</p>
				{:else}
					<span></span>
				{/if}

				{#if showCounter}
					<span
						class="text-xs tabular-nums transition-colors {isOverLimit
							? 'text-destructive font-medium'
							: remaining <= 20
								? 'text-yellow-500 dark:text-yellow-400'
								: 'text-muted-foreground'}"
					>
						{remaining}
					</span>
				{/if}
			</div>
		</div>
	</Card.Content>

	<Card.Footer>
		<Button onclick={sendMessage} class="w-full" disabled={isOverLimit || !newMessage.trim()}>
			Send
		</Button>
	</Card.Footer>
</Card.Root>
