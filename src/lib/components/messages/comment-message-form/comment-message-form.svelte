<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
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

<div class="flex items-center gap-2 px-2 pb-2">
	<Input
		placeholder="Add a reply…"
		bind:value={commentBody}
		maxlength={128}
		class="font-mono text-sm"
	/>
	<Button onclick={sendComment} size="sm" variant="outline">send</Button>
</div>
