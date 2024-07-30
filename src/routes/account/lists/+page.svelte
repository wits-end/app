<script lang="ts">
	import DragulaFeedCondensed from './DragulaFeedCondensed.svelte';
	import DndFeedCondensed from './DndFeedCondensed.svelte';
	import type { PageData } from '../$types';
	import Edit from '$lib/components/icons/edit.svelte';
	import EditableMinion from './EditableMinion.svelte';
	import { enhance } from '$app/forms';
	import Loading from '$lib/components/icons/loading.svelte';

	export let data: PageData;

	let { articles, lists, profile } = data;
	$: ({ lists } = data);

	let draggedItem;
	let pending;
	let deleting = [];
</script>

<svelte:head>
	<title>Reading Lists | Wits End</title>
	<meta
		name="description"
		content="Personal AI notebook. View your saved articles and create custom reading lists."
	/>
</svelte:head>

<div class="library">
	<div class="saved-articles">
		<h3 class="minion">Saved Articles</h3>
		<DragulaFeedCondensed {articles} bind:draggedItem />
	</div>
	<div class="board">
		{#each lists.filter((list) => !deleting.includes(list.id)) as list (list.id)}
			<div class="list">
				<div class="heading">
					<div class="edit-icon">
						<Edit />
					</div>
					<h3 class="minion">
						<EditableMinion
							bind:value={list.name}
							on:submit={() => {
								lists = lists;
							}}
							listId={list.id}
						/>
					</h3>
					<form
						action="?/deleteList"
						method="POST"
						use:enhance={() => {
							deleting = [...deleting, list.id];
							return async ({ update }) => {
								await update();
								deleting = deleting.filter((id) => id !== list.id);
							};
						}}
					>
						<input type="hidden" name="id" value={list.id} />
						<button type="submit">delete list</button>
					</form>
				</div>
				<DndFeedCondensed bind:articles={list.articles} listId={list.id} bind:draggedItem />
			</div>
		{/each}
		<div class="new">
			{#if pending}
				<div>
					<Loading />
				</div>
			{:else}
				<form
					action="?/createList"
					method="POST"
					use:enhance={() => {
						pending = true;

						return async ({ result, update }) => {
							await update();
							pending = false;
						};
					}}
				>
					<input type="hidden" name="name" value="New List" />
					<input
						type="hidden"
						name="previousRank"
						value={lists.length ? lists[lists.length - 1].position : ''}
					/>
					<button type="submit">+ Add another list</button>
				</form>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.library {
		display: grid;
		grid-template-columns: auto 1fr;

		.saved-articles {
			padding-left: 2rem;
			border-right: 1px solid #ddd;
			width: 35rem;

			.minion {
				padding: 0;
				margin: 0;
				flex: 1 0 auto;
				line-height: 1.75;
				padding: 1rem 0;
				margin-top: -1rem;
				margin-bottom: 0;
				margin-right: 2rem;
			}

			&:first-child {
				padding-left: 0;
			}
		}
		.board {
			display: flex;
			overflow-x: auto;
			overflow-y: hidden;

			.list {
				padding-left: 2rem;
				border-right: 1px solid #ddd;
				width: 36rem;
				position: relative;
				flex: 0 0 auto;

				.heading {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 1rem 0;
					margin-top: -1rem;
					margin-bottom: 0;
					margin-right: 2rem;
					border-bottom: 1px solid #ddd;

					.edit-icon {
						height: 18px;
						margin-right: 0.5rem;
					}
					.minion {
						border-bottom: 0;
						padding: 0;
						margin: 0;
						flex: 0 0 auto;
						margin-right: 1rem;
						line-height: 1.75;
					}
					form {
						font-size: 0;
						margin-left: auto;

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
			.new {
				min-width: 16rem;
				margin-left: 1rem;

				button {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: none;
					background: white;
					border: 1px solid #ddd;
					color: #999;
					padding: 0.5rem 1rem;
					transition: all 0.2s ease;

					&:hover {
						border: 1px solid #666;
						color: #000;
					}
				}
			}
		}
	}
</style>
