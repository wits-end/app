<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import { flip } from 'svelte/animate';
	import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	import { LexoRank } from 'lexorank';
	import { enhance } from '$app/forms';

	dayjs.extend(relativeTime);

	export let articles;
	export let listId;
	export let draggedItem;

	$: items = articles;
	let deleting = [];

	$: draggedItem, checkItemInList();

	let flipDurationMs = 300;
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
			const idx = e.detail.items.findIndex((item) => item.id === id);

			let position;
			let previousPosition;
			let nextPosition;

			if (idx == 0 && e.detail.items.length == 1) {
				// Empty list
				previousPosition = null;
				nextPosition = null;
				position = LexoRank.middle().toString();
			} else if (idx == 0) {
				// Start of list
				previousPosition = null;
				nextPosition = e.detail.items[1].position;
				position = LexoRank.parse(nextPosition).genPrev().toString();
			} else if (idx == e.detail.items.length - 1) {
				// End of list
				previousPosition = e.detail.items[idx - 1].position;
				nextPosition = null;
				position = LexoRank.parse(previousPosition).genNext().toString();
			} else {
				// Middle of list
				previousPosition = e.detail.items[idx - 1].position;
				nextPosition = e.detail.items[idx + 1].position;
				position = LexoRank.parse(previousPosition)
					.between(LexoRank.parse(nextPosition))
					.toString();
			}

			e.detail.items[idx].position = position;

			const res = fetch('?/addArticleToList', {
				method: 'POST',
				body: JSON.stringify({
					oldListId: draggedItem.oldListId,
					newListId: listId,
					articleId: draggedItem.ogId,
					position: position
				})
			});
		}

		items = e.detail.items;
		draggedItem = null;
		dropFromOthersDisabled = false;
	}

	function checkItemInList() {
		let arxivIds = items.map((item) => item.arxiv_id);
		dropFromOthersDisabled = arxivIds.includes(draggedItem?.arxiv_id);
	}
</script>

<div
	class="feed"
	use:dndzone={{
		items: items.filter((item) => !deleting.includes(item.id)),
		flipDurationMs,
		dropTargetStyle: {
			background: '#eee'
		},
		dropFromOthersDisabled,
		morphDisabled: true
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items.filter((item) => !deleting.includes(item.id)) as item (item.id)}
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
					<form
						action="?/removeArticleFromList"
						method="POST"
						use:enhance={() => {
							deleting = [...deleting, item.id];
							return async ({ update }) => {
								await update();
								deleting = deleting.filter((id) => id !== item.id);
							};
						}}
					>
						<input type="hidden" name="listId" value={listId} />
						<input type="hidden" name="articleId" value={item.ogId} />
						<button type="submit">remove from list</button>
					</form>
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
				margin-bottom: 0;
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
				form {
					display: inline-block;
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
