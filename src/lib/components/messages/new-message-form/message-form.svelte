<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	import pb from '$lib/pocketbase';

	let { refresh } = $props<{ refresh: () => void }>();
	let newMessage = $state('');
	async function sendMessage() {
		if (!newMessage) return;

		const message = {
			body: newMessage,
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
		<div class="flex items-center p-4 gap-2">
			<Input placeholder="Type your message here..." bind:value={newMessage} maxlength={128} />
		</div>
	</Card.Content>

	<Card.Footer>
		<button onclick={sendMessage} class="w-full" data-sveltekit-reload>
			<Button class="w-full">Send</Button>
		</button>
	</Card.Footer>
</Card.Root>
