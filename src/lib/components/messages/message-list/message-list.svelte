<script lang="ts">
	import ChevronsDownIcon from '@lucide/svelte/icons/chevrons-down';
	import CommentMessageForm from '$lib/components/messages/comment-message-form/comment-message-form.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';

	//get messages from props

	let { messages, refresh } = $props();
</script>

{#if messages}
	<ul>
		{#each messages as message}
			<Collapsible.Root class="space-y-2 my-1">
				<Collapsible.Trigger
					class="  w-full p-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
				>
					<div class="font-mono flex-1 text-left break-words whitespace-normal">
						~anon says: {message.body}
					</div>
					<div class="flex justify-end">
						<ChevronsDownIcon />
					</div>
					<span class="sr-only">Toggle</span>
				</Collapsible.Trigger>
				<Collapsible.Content>
					{#if message.expand && message.expand.comments}
						{#each message.expand.comments as comment}
							<ul class=" bg-zinc-100 dark:bg-zinc-800">
								<li class=" text-sm py-1">
									<div class="font-mono">
										~anon replied: {comment.body}
									</div>
								</li>
							</ul>
						{/each}
					{/if}
					<div class="my-2">
						<CommentMessageForm parentMessageId={message.id} {refresh} />
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		{/each}
	</ul>
{/if}
