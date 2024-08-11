<script lang="ts">
	import FeedVerbose from '$lib/components/feedVerbose.svelte';
	import FeedCondensed from '$lib/components/feedCondensed.svelte';
	import { createArticleStore, filterHandler } from '$lib/stores/articles.js';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Search from './Search.svelte';
	import Sort from './Sort.svelte';
	import Tags from './Tags.svelte';
	import Categories from './Categories.svelte';

	export let data;
	let { articles, profile, session } = data;

	// Store for articles
	const articleStore = createArticleStore(articles);
	const unsubscribe = articleStore.subscribe((model) => filterHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	// Reactive filters
	const handlePaginate = (page) => {
		$page.url.searchParams.set('page', page);
		goto(`?${$page.url.searchParams.toString()}`);
		$articleStore.page = page;
	};
</script>

<svelte:head>
	<title>Home | Dead Neuron</title>
	<meta
		name="description"
		content="Enhancing the productivity and impact of researchers through an AI-powered web platform that simplifies the management of academic literature."
	/>
</svelte:head>

<div class="wrapper">
	<div class="filters">
		<Categories {articleStore} />
	</div>

	<div class="grid">
		<div class="trending col">
			<FeedVerbose articles={$articleStore.filtered.slice(0, 3)} {profile} />
		</div>
		<div class="recent col">
			<FeedCondensed articles={$articleStore.filtered.slice(3)} {profile} />
		</div>
		<div class="tools col">
			<Search {articleStore} />

			<Sort {articleStore} {profile} />

			<Tags {articleStore} />

			<div class="about">
				<h3 class="minion">About</h3>
				<p>
					Dead Neuron offers a curated collection of the best machine learning research papers along
					with concise synopses that highlights their key ideas and contributions. Create an account
					to save papers, organize reading lists, record personal notes, and receive personalized
					recommendations according to your interests. We're developing a platform for new and
					experienced AI/ML enthusiasts to better explore the research landscape. Join us on this
					stochastic gradient descent into madness and uncover the insights that are shaping the
					future of artificial intelligence.
				</p>
			</div>
		</div>
	</div>
	<div class="pagination">
		{#if $articleStore.page > 0}
			<button
				class="page-button"
				on:click={() => {
					handlePaginate($articleStore.page - 1);
				}}>Prev</button
			>
		{/if}
		{#if $articleStore.filtered.length == 14}
			<button
				class="page-button"
				on:click={() => {
					handlePaginate($articleStore.page + 1);
				}}>Next</button
			>
		{/if}
	</div>
</div>

<style lang="scss">
	.wrapper {
		.filters {
			border-bottom: 1px solid #ddd;

			@media screen and (max-width: 600px) {
				grid-column: auto;
			}
		}
		.grid {
			display: grid;
			grid-template-rows: auto auto;
			grid-template-columns: 2fr 1fr 1fr;
			grid-gap: 2rem;
			margin-top: 2rem;

			.col {
				padding: 1rem 2rem 1rem 0;
				border-right: 1px solid #ddd;

				&:last-child {
					border-right: none;
					padding-right: 0;
				}

				.about {
					margin: 2rem 0;

					p {
						font-size: 1.4rem;
					}
				}
			}
		}
		.pagination {
			padding-top: 1rem;
			border-top: 1px solid #ddd;

			.page-button {
				font-family: 'Open Sans';
				font-size: 1.2rem;
				font-weight: 500;
				text-transform: uppercase;
				text-decoration: none;
				margin-right: 1rem;
				color: #aaa;
				background: none;
				border: none;

				&.active,
				&:hover {
					color: #d33682;
					cursor: pointer;
					font-weight: bold;
				}
			}
		}
	}
</style>
