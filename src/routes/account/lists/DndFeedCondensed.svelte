<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import { flip } from 'svelte/animate';
	import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	import { onMount } from 'svelte';

	dayjs.extend(relativeTime);

	export let articles;
	export let listId;
	export let draggedItem;

	let items = articles;

	$: draggedItem, checkItemInList();

	let flipDurationMs = 300;
	let shouldIgnoreDndEvents = false;
	let dropFromOthersDisabled = false;

	function handleDndConsider(e) {
		const { trigger, id } = e.detail.info;
		if (trigger === TRIGGERS.DRAG_STARTED) {
			const idx = items.findIndex((item) => item.id === id);
			draggedItem = items[idx];
			draggedItem.oldListId = listId;
		}

		items = e.detail.items;
	}
	function handleDndFinalize(e) {
		const { trigger, id } = e.detail.info;
		if (trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			const res = fetch('?/addArticleToList', {
				method: 'POST',
				body: JSON.stringify({
					oldListId: draggedItem.oldListId,
					newListId: listId,
					articleId: draggedItem.ogId,
					position: '0'
				})
			});
		}

		items = e.detail.items;
		draggedItem = null;
		dropFromOthersDisabled = false;
	}

	function handleRemoveFromList() {
		console.log('Remove');
	}

	function checkItemInList() {
		let arxivIds = items.map((item) => item.arxiv_id);
		dropFromOthersDisabled = arxivIds.includes(draggedItem?.arxiv_id);
	}
</script>

<div
	class="feed"
	use:dndzone={{
		items,
		flipDurationMs,
		dropTargetStyle: {
			outline: '1px solid #d33682',
			background: '#eee'
		},
		dropFromOthersDisabled,
		morphDisabled: true
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items as item (item.id)}
		<div class="post-wrapper" animate:flip={{ duration: flipDurationMs }}>
			<!-- <p>{item.id}</p> -->
			<div class="post">
				<p class="published-date">
					{dayjs(item?.published_at).format('YYYY-MM-DD')}
				</p>
				<h2 class="title"><a href="/article/{item?.ogId}">{item?.title}</a></h2>
				<div class="actions">
					<p class="date">{dayjs().to(dayjs(item?.published_at))}</p>
					<a class="read-more" href="/article/{item?.ogId}">read more</a>
					<button
						on:click={() => {
							handleRemoveFromList();
						}}>remove from list</button
					>
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.feed {
		margin-right: 2rem;
		height: 100%;
	}
	:global(#dnd-action-dragged-el) {
		// box-shadow: 0 0 3px #000;
		border: none;
		outline: none;
		background: white;
	}
	:global(#dnd-action-dragged-el .post) {
	}
	.post-wrapper {
		background: white;
		padding: 2rem 0;
		border-bottom: 1px solid #ddd;

		.post {
			.published-date {
				font-size: 1.3rem;
				margin: 0;
			}

			h2.title {
				font-family: 'Open Sans';
				font-size: 1.6rem;

				a {
					color: black;
					text-decoration: none;

					&:hover {
						color: #d33682;
					}
				}
			}

			.actions {
				font-size: 0;
				p {
					display: inline-block;
					font-size: 1.2rem;
					margin: 0;
				}
				a {
					font-size: 1.2rem;
				}
				.date,
				.read-more {
					padding-right: 1rem;
					padding-bottom: 0.25rem;
				}
				.read-more,
				button {
					border-left: 1px solid #ddd;
					padding-left: 1rem;
					padding-bottom: 0.25rem;
				}
				button {
					background: none;
					border: none;
					border-left: 1px solid #ddd;
					color: #d33682;
					text-decoration: underline;
					font-size: 1.2rem;

					&:hover {
						color: #e99ac0;
					}
				}
			}
		}
		&:last-child {
			border: none;
		}
	}
</style>
