<script lang="ts">
	import type { PageData } from './$types';
	import FeedCondensed from '$lib/feedCondensed.svelte';

	export let data: PageData;
	// $: ({ articles } = data);

	let folders = [
		{
			label: 'Saved Articles',
			isExpanded: true,
			children: []
		},
		{
			label: 'CV',
			isExpanded: false,
			children: []
		},
		{
			label: 'NLP',
			isExpanded: false,
			children: []
		}
	];

	let toggleExpansion = (folder) => {
		folder.isExpanded = !folder.isExpanded;
		folders = folders;
	};
</script>

<div class="grid">
	<div class="tree col">
		{#each folders as folder}
			<h3 class="minion" on:click={() => toggleExpansion(folder)}>
				{folder.isExpanded ? '\u25BE' : '\u25B8'}
				{folder.label}
			</h3>

			{#if folder.isExpanded}
				<FeedCondensed {data} />
				<!-- {#each articles as article}
					<p>{article.title}</p>
				{:else}
					<p>n/a</p>
				{/each} -->
			{/if}
		{/each}
	</div>
	<div class="col">
		<!-- <h1>{user?.email}</h1> -->
		<p>
			Welcome to Dead Neuron and thank you for registering. This is the account homepage. Here you
			should be able to navigate to all of the pages specific to you.
		</p>
	</div>
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 3fr;
		grid-gap: 2rem;
		margin-top: 2rem;

		.col {
			padding: 1rem;
			padding-left: 0;
			border-right: 1px solid #ddd;

			&:last-child {
				border: none;
			}
		}

		.tree {
			.minion {
				font-family: 'Open Sans';
				text-transform: uppercase;
				font-size: 1.4rem;
				line-height: 1.4rem;
				color: #666;
				padding-bottom: 1rem;
				margin-bottom: 1rem;
				border-bottom: 1px solid #ddd;
			}
		}
	}
</style>
