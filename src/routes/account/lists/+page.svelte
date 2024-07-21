<script lang="ts">
	import DragulaFeedCondensed from './DragulaFeedCondensed.svelte';
	import DndFeedCondensed from './DndFeedCondensed.svelte';
	import type { PageData } from '../$types';
	import Edit from '$lib/components/icons/edit.svelte';

	export let data: PageData;

	let { articles, lists, profile } = data;

	console.log(lists[lists.length - 1].position);

	function handleDeleteList() {
		console.log('Delete');
	}
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
		<DragulaFeedCondensed {articles} />
	</div>
	<div class="board">
		{#each lists as list}
			<div class="list">
				{#if list.name == 'New List'}
					<div class="edit-icon">
						<Edit />
					</div>
					<h3 class="minion" contenteditable>
						{list.name}
					</h3>
				{:else}
					<h3 class="minion" contenteditable>
						{list.name}
					</h3>
				{/if}
				<form action="?/deleteList" method="POST">
					<input type="hidden" name="id" value={list.id} />
					<button type="submit">x</button>
				</form>
				<DndFeedCondensed articles={list.articles} />
			</div>
		{/each}
		<div class="new">
			<form action="?/createList" method="POST">
				<input type="hidden" name="name" value="New List" />
				<input type="hidden" name="previousRank" value={lists[lists.length - 1].position} />
				<button type="submit">+ Add another list</button>
			</form>
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
			width: 350px;

			.minion {
				margin-right: 2rem;
			}

			&:first-child {
				padding-left: 0;
			}
		}
		.board {
			display: flex;

			.list {
				padding-left: 2rem;
				border-right: 1px solid #ddd;
				width: 350px;
				position: relative;

				.edit-icon {
					float: left;
					height: 16px;
					width: 16px;
					margin-right: 1rem;
					margin-top: -0.5rem;
				}
				.minion {
					margin-right: 2rem;
				}
				form {
					float: right;

					button {
						font-family: 'Open Sans';
						font-size: 1.2rem;
						font-weight: 500;
						text-transform: uppercase;
						text-decoration: none;
						margin-left: 1rem;
						background: white;
						border: 1px solid #ddd;
						color: #999;
						// padding: 0.5rem 1rem;
						padding: 0 0.5rem;
						transition: all 0.2s ease;

						&:hover {
							border: 1px solid #666;
							color: #000;
						}
					}
				}
			}
			.new {
				button {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: none;
					margin-left: 1rem;
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
