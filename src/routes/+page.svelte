<script lang="ts">
	import FeedVerbose from '$lib/feedVerbose.svelte';
	import FeedCondensed from '$lib/feedCondensed.svelte';
	import Sort from '$lib/sort.svelte';
	import Tags from '$lib/tags.svelte';
	import { createArticleStore, filterHandler } from '$lib/stores/search.js';
	import { onDestroy, beforeUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;
	let { articles, profile, session } = data;

	// Store for articles
	const articleStore = createArticleStore(articles);
	const unsubscribe = articleStore.subscribe((model) => filterHandler(model));
	onDestroy(() => {
		unsubscribe();
	});

	// Handle url params on load
	const categoryParam = $page.url.searchParams.get('category') || 'all';
	const tagParam = $page.url.searchParams.get('tag') || 'all';
	const searchParam = $page.url.searchParams.get('search') || '';

	$articleStore.category = categoryParam;
	$articleStore.tag = tagParam;
	$articleStore.search = searchParam;

	// Reactive category filter
	const categories = [
		['cs.AI', 'Artificial Intelligence'],
		['cs.CV', 'Computer Vision'],
		['cs.LG', 'Machine Learning'],
		['cs.CL', 'Natural Language Processing'],
		['cs.NE', 'Neuroevolution'],
		['stat.ML', 'Statistics']
	];

	const handleCategory = (e, category: string) => {
		$page.url.searchParams.set('category', category);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('category-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.category = category;
	};

	// Reactive tag filter
	const tags = [
		'ensemble',
		'optimization',
		'pruning',
		'distillation',
		'diffusion',
		'generative',
		'tuning',
		'reinforcement',
		'unsupervised',
		'supervised',
		'classification',
		'regression',
		'regularization',
		'evolution',
		'sparsity',
		'latent',
		'quantization',
		'augmentation',
		'federated',
		'transfer',
		'attention',
		'bayesian',
		'interpretability',
		'clustering',
		'embedding',
		'efficient',
		'segmentation',
		'theory'
	];

	const handleTag = (e, tag: string) => {
		$page.url.searchParams.set('tag', tag);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('tag-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.tag = tag;
	};

	// Reactive data for the article feeds
	$: featuredFeedData = {
		articles: $articleStore.filtered.slice(0, 3),
		profile: profile,
		session: session
	};

	$: condensedFeedData = {
		articles: $articleStore.filtered.slice(3),
		profile: profile,
		session: session
	};
</script>

<div class="wrapper">
	<div class="filters">
		<nav class="categories">
			<button
				class="category-button active"
				on:click={(e) => {
					handleCategory(e, 'all');
				}}>All</button
			>
			{#each categories as [key, value]}
				<button
					class="category-button"
					on:click={(e) => {
						handleCategory(e, key.toLowerCase());
					}}>{value}</button
				>
			{/each}
		</nav>
	</div>

	<div class="grid">
		<div class="trending col">
			<FeedVerbose data={featuredFeedData} />
		</div>
		<div class="recent col">
			<FeedCondensed data={condensedFeedData} />
		</div>
		<div class="tools col">
			<div class="search">
				<h3 class="minion">Search</h3>
				<div class="field-group">
					<div class="icon">
						<svg
							aria-hidden="true"
							data-prefix="fas"
							data-icon="search"
							class="svg-inline--fa fa-search fa-w-16"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
						>
							<path
								fill="currentColor"
								d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
							/>
						</svg>
					</div>
					<input
						type="text"
						placeholder="Articles, Datasets, Research and more..."
						bind:value={$articleStore.search}
						on:input={() => {
							$page.url.searchParams.set('search', $articleStore.search);

							if ($articleStore.search == '') {
								$page.url.searchParams.delete('search');
							}
						}}
					/>
				</div>
			</div>
			<Sort />

			<div class="tags">
				<h3 class="minion">Tags</h3>
				<button
					class="tag-button active"
					on:click={(e) => {
						handleTag(e, 'all');
					}}>All</button
				>{#each tags as tag}
					<button
						class="tag-button"
						on:click={(e) => {
							handleTag(e, tag.toLowerCase());
						}}>{tag}</button
					>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		.filters {
			border-bottom: 1px solid #ddd;

			.categories {
				padding-bottom: 2rem;

				.category-button {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: none;
					margin-right: 2rem;
					color: #aaa;
					background: none;
					border: none;

					&.active,
					&:hover {
						color: red;
						cursor: pointer;
					}
				}
				@media screen and (max-width: 600px) {
					display: none;
				}
			}

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
				padding: 1rem;
				padding-left: 0;
				border-right: 1px solid #ddd;

				&:last-child {
					border-right: none;
				}

				.search {
					.field-group {
						position: relative;
						width: 100%;

						.icon {
							position: absolute;
							left: 1rem;
							top: 50%;
							transform: translateY(-50%);
							width: 1.5rem;
							color: #0004;
						}
						input {
							width: 100%;
							background: white;
							padding: 1.5rem;
							color: #0008;
							border: 1px solid #ddd;
							padding-left: 3.5rem;
							font-family: 'Open Sans';
						}
					}
				}
				.tags {
					padding: 2rem 0;

					.tag-button {
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
							color: red;
							cursor: pointer;
						}
					}
				}
			}
		}
	}
</style>
