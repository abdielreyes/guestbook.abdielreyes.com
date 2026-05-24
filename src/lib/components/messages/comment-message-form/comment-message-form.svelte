<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import pb from '$lib/pocketbase';

	const MAX_LENGTH = 280;

	let { parentMessageId, refresh } = $props<{ parentMessageId: string; refresh: () => void }>();
	let commentBody = $state('');

	let remaining = $derived(MAX_LENGTH - commentBody.length);
	let isOverLimit = $derived(commentBody.length > MAX_LENGTH);
	let showCounter = $derived(commentBody.length >= MAX_LENGTH - 40);

	async function sendComment() {
		if (!commentBody.trim()) return;

		// Backend guard — rejects even if maxlength was bypassed
		if (commentBody.length > MAX_LENGTH) return;

		const comment = {
			body: commentBody.trim(),
			active: true,
			author: window.navigator.userAgent,
			message_id: parentMessageId,
			created: new Date().toISOString()
		};

		const responseComment = await pb.collection('comments').create(comment);
		if (!responseComment) {
			console.error('Failed to send comment');
			return;
		}

		const appended = await pb.collection('messages').update(parentMessageId, {
			'comments+': [responseComment.id]
		});
		if (!appended) {
			console.error('Failed to append comment to message');
			return;
		}

		commentBody = '';
		refresh();
	}
</script>

<div class="flex flex-col gap-1 px-2 pb-2">
	<div class="flex items-center gap-2">
		<Input
			placeholder="Add a reply…"
			bind:value={commentBody}
			maxlength={MAX_LENGTH}
			class="font-mono text-sm"
		/>
		<Button
			onclick={sendComment}
			size="sm"
			variant="outline"
			disabled={isOverLimit || !commentBody.trim()}
		>
			send
		</Button>
	</div>

	{#if showCounter}
		<span
			class="text-xs tabular-nums text-right pr-1 transition-colors {isOverLimit
				? 'text-destructive font-medium'
				: remaining <= 20
					? 'text-yellow-500 dark:text-yellow-400'
					: 'text-muted-foreground'}"
		>
			{remaining}
		</span>
	{/if}
</div>
