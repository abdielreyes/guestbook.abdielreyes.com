<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import pb from '$lib/pocketbase';
	import { MAX_MESSAGE_LENGTH } from '$lib/constants';

	let { parentMessageId, onSuccess } = $props<{
		parentMessageId: string;
		onSuccess: (comment: App.Comment) => void;
	}>();

	let commentBody = $state('');
	let error = $state('');
	let isSubmitting = $state(false);

	let remaining = $derived(MAX_MESSAGE_LENGTH - commentBody.length);
	let isOverLimit = $derived(commentBody.length > MAX_MESSAGE_LENGTH);
	let showCounter = $derived(commentBody.length >= MAX_MESSAGE_LENGTH - 40);

	async function sendComment() {
		if (!commentBody.trim() || isOverLimit || isSubmitting) return;

		error = '';
		isSubmitting = true;

		try {
			const responseComment = await pb.collection('comments').create({
				body: commentBody.trim(),
				message_id: parentMessageId
			});

			await pb.collection('messages').update(parentMessageId, {
				'comments+': [responseComment.id]
			});

			const newComment: App.Comment = {
				id: responseComment.id,
				body: responseComment['body'],
				author: responseComment['author'],
				message_id: parentMessageId,
				created: responseComment.created
			};

			commentBody = '';
			onSuccess(newComment);
		} catch {
			error = 'Failed to send reply. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex flex-col gap-1 px-2 pb-2">
	<div class="flex items-center gap-2">
		<Input
			placeholder="Add a reply…"
			bind:value={commentBody}
			maxlength={MAX_MESSAGE_LENGTH}
			disabled={isSubmitting}
			class="font-mono text-sm"
		/>
		<Button
			onclick={sendComment}
			size="sm"
			variant="outline"
			disabled={isOverLimit || !commentBody.trim() || isSubmitting}
		>
			{isSubmitting ? '…' : 'send'}
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

	{#if error}
		<p class="text-xs text-destructive px-1">{error}</p>
	{/if}
</div>
