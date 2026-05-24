<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';
	import MessageSquarePlusIcon from '@lucide/svelte/icons/message-square-plus';
	import CommentMessageForm from '$lib/components/messages/comment-message-form/comment-message-form.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';

	dayjs.extend(relativeTime);

	let {
		messages,
		onCommentSent
	}: {
		messages: App.Message[];
		onCommentSent: (messageId: string, comment: App.Comment) => void;
	} = $props();

	let showFormFor = $state<Record<string, boolean>>({});

	// Ticks every minute so relative timestamps ("2 min ago") stay current
	let now = $state(Date.now());
	$effect(() => {
		const id = setInterval(() => (now = Date.now()), 60_000);
		return () => clearInterval(id);
	});

	function formatTime(created?: string): string {
		if (!created) return '';
		const m = dayjs(created);
		const diffHours = (now - m.valueOf()) / (1000 * 60 * 60);
		return diffHours < 24 ? m.fromNow() : m.format('MMM D, YYYY · h:mm A');
	}

	function hasComments(message: App.Message) {
		return message.comments && message.comments.length > 0;
	}

	function handleCommentSuccess(messageId: string, comment: App.Comment) {
		onCommentSent(messageId, comment); // update parent state
		showFormFor[messageId] = false;    // auto-close the form
	}
</script>

{#if messages && messages.length > 0}
	<ul class="flex flex-col gap-1">
		{#each messages as message}
			<li>
				<!-- ── trigger row ─────────────────────────────────────── -->
				<Collapsible.Root class="group">
					{#if hasComments(message)}
						<Collapsible.Trigger
							class="w-full p-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
						>
							<div class="flex-1 text-left min-w-0">
								<div class="font-mono break-words whitespace-normal">
									~anon says: {message.body}
								</div>
								<div class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono">
									{formatTime(message.created)}
								</div>
							</div>
							<div class="flex items-center justify-end gap-2 shrink-0 pl-2">
								<span class="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
									<MessageSquareIcon class="w-4 h-4" />
									{message.comments!.length}
								</span>
								<ChevronDownIcon
									class="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
								/>
							</div>
							<span class="sr-only">Toggle replies</span>
						</Collapsible.Trigger>
					{:else}
						<div class="w-full p-2 bg-zinc-300 dark:bg-zinc-700">
							<div class="font-mono break-words whitespace-normal">
								~anon says: {message.body}
							</div>
							<div class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono">
								{formatTime(message.created)}
							</div>
						</div>
					{/if}

					<!-- ── comments list ─────────────────────────────────── -->
					{#if hasComments(message)}
						<Collapsible.Content>
							{#if message.expand?.comments}
								{#each message.expand.comments as comment}
									<div
										class="bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-sm font-mono border-l-2 border-zinc-300 dark:border-zinc-600 flex justify-between items-start gap-3"
									>
										<span class="break-words min-w-0">~anon replied: {comment.body}</span>
										<span
											class="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5 font-mono"
										>
											{formatTime(comment.created)}
										</span>
									</div>
								{/each}
							{/if}
						</Collapsible.Content>
					{/if}
				</Collapsible.Root>

				<!-- ── always-visible reply area ──────────────────────── -->
				<div class="flex flex-col bg-zinc-200 dark:bg-zinc-800/50 px-2 py-1 gap-2">
					<button
						onclick={() => (showFormFor[message.id] = !showFormFor[message.id])}
						class="flex items-center gap-1.5 w-fit py-0.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors"
					>
						<MessageSquarePlusIcon class="w-3.5 h-3.5" />
						{showFormFor[message.id] ? 'cancel' : 'reply'}
					</button>

					{#if showFormFor[message.id]}
						<CommentMessageForm
							parentMessageId={message.id}
							onSuccess={(comment) => handleCommentSuccess(message.id, comment)}
						/>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{:else if messages}
	<p class="font-mono text-sm text-white/40 text-center py-6">
		no messages yet — be the first to sign!
	</p>
{/if}
