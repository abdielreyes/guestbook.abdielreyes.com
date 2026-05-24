<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import pb from '$lib/pocketbase';
	import { MAX_MESSAGE_LENGTH } from '$lib/constants';

	let { onSent } = $props<{ onSent: (msg: App.Message) => void }>();

	let newMessage = $state('');
	let error = $state('');
	let isSubmitting = $state(false);

	let remaining = $derived(MAX_MESSAGE_LENGTH - newMessage.length);
	let isOverLimit = $derived(newMessage.length > MAX_MESSAGE_LENGTH);
	let showCounter = $derived(newMessage.length >= MAX_MESSAGE_LENGTH - 40);

	async function sendMessage() {
		if (!newMessage.trim() || isOverLimit || isSubmitting) return;

		error = '';
		isSubmitting = true;

		try {
			const response = await pb.collection('messages').create({ body: newMessage.trim() });

			const newMsg: App.Message = {
				id: response.id,
				body: response['body'],
				author: response['author'],
				comments: [],
				expand: { comments: [] },
				created: response.created
			};

			newMessage = '';
			onSent(newMsg);
		} catch {
			error = 'Failed to send message. Please try again.';
		} finally {
			isSubmitting = false;
		}
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
				maxlength={MAX_MESSAGE_LENGTH}
				rows={3}
				disabled={isSubmitting}
				class="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
			></textarea>

			<div class="flex items-center justify-between px-1 min-h-[1.25rem]">
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
		<Button
			onclick={sendMessage}
			class="w-full"
			disabled={isOverLimit || !newMessage.trim() || isSubmitting}
		>
			{isSubmitting ? 'Sending…' : 'Send'}
		</Button>
	</Card.Footer>
</Card.Root>
