<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import { flip } from 'svelte/animate';
	import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';

	dayjs.extend(relativeTime);

	export let articles;
	export let draggedItem;

	let items = articles;
	items.map((item) => {
		item.ogId = item.id;
	});

	const flipDurationMs = 300;
	let shouldIgnoreDndEvents = true;

	function handleDndConsider(e) {
		// console.warn(`got consider ${JSON.stringify(e.detail, null, 2)}`);
		const { trigger, id } = e.detail.info;
		if (trigger === TRIGGERS.DRAG_STARTED) {
			// console.warn(`copying ${id}`);
			const idx = items.findIndex((item) => item.id === id);
			const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`;
			// the line below was added in order to be compatible with version svelte-dnd-action 0.7.4 and above
			e.detail.items = e.detail.items.filter((item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
			e.detail.items.splice(idx, 0, { ...items[idx], id: newId });

			draggedItem = e.detail.items[idx];
			draggedItem.oldListId = null;

			items = e.detail.items;
			shouldIgnoreDndEvents = true;
		} else if (!shouldIgnoreDndEvents) {
			items = e.detail.items;
		} else {
			items = [...items];
		}
	}
	function handleDndFinalize(e) {
		// console.warn(`got finalize ${JSON.stringify(e.detail, null, 2)}`);
		// console.log(e.detail);
		draggedItem = null;

		if (!shouldIgnoreDndEvents) {
			items = e.detail.items;
		} else {
			items = [...items];
			shouldIgnoreDndEvents = false;
		}
	}
</script>

<div
	class="feed"
	use:dndzone={{
		items,
		flipDurationMs,
		dropFromOthersDisabled: true,
		dropTargetStyle: {
			outline: 'none',
			background: '#fff'
		}
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items as item (item.id)}
		<div class="post-wrapper" animate:flip={{ duration: flipDurationMs }}>
			<div class="post">
				<p class="published-date">
					{dayjs(item?.published_at).format('YYYY-MM-DD')}
				</p>
				<h2 class="title"><a href="/article/{item?.ogId}">{item?.title}</a></h2>
				<div class="actions">
					<p class="date">{dayjs().to(dayjs(item?.published_at))}</p>
					<a class="read-more" href="/article/{item?.ogId}">read more</a>
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.feed {
		margin-right: 2rem;
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
				form {
					border-left: 1px solid #ddd;
					padding-left: 1rem;
					padding-bottom: 0.25rem;
				}
				form {
					display: inline-block;
					button {
						background: none;
						border: none;
						color: #d33682;
						text-decoration: underline;
						font-size: 1.2rem;

						&:hover {
							color: #e99ac0;
						}
					}
				}
			}
		}
		&:last-child {
			border: none;
		}
	}
</style>
