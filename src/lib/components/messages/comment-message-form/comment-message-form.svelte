<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import pb from '$lib/pocketbase';
	let { parentMessageId, refresh } = $props<{ parentMessageId: string; refresh: () => void }>();
	let commentBody = $state('');
	async function sendComment() {
		if (commentBody.trim() == '') return;
		const comment = {
			body: commentBody,
			active: true,
			author: window.navigator.userAgent,
			message_id: parentMessageId,
			created: new Date().toISOString()
		};

		const responseComment = await pb.collection('comments').create(comment);
		if (!responseComment) {
			console.error('Failed to send comment');
			return;
		} else {
			//append new comment to message
			const appendedCommenttoMessage = await pb.collection('messages').update(parentMessageId, {
				'comments+': [responseComment.id]
			});
			if (!appendedCommenttoMessage) {
				console.error('Failed to append comment to message');
				return;
			}

			commentBody = '';
			refresh();
		}
	}
</script>

<Card.Root>
	<Card.Content>
		<div class="flex items-center p-4 gap-2">
			<Input placeholder="Add a comment" bind:value={commentBody} maxlength={128} />
		</div>
	</Card.Content>

	<Card.Footer>
		<button onclick={sendComment} class="w-full" data-sveltekit-reload>
			<Button class="w-full">Comment</Button>
		</button>
	</Card.Footer>
</Card.Root>
