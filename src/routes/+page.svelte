<script lang="ts">
	import FeedVerbose from '$lib/feedVerbose.svelte';
	import FeedCondensed from '$lib/feedCondensed.svelte';
	import Sort from '$lib/sort.svelte';
	import Tags from '$lib/tags.svelte';
	import { createArticleStore, filterHandler } from '$lib/stores/search.js';
	import { onDestroy, beforeUpdate, onMount } from 'svelte';
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
	onMount(() => {
		let categoryParam = $page.url.searchParams.get('category') || 'all';
		let tagParam = $page.url.searchParams.get('tag') || 'all';
		let searchParam = $page.url.searchParams.get('search') || '';
		let sortParam = $page.url.searchParams.get('sort') || 'recent';
		let timeParam = $page.url.searchParams.get('time') || 'alltime';
		let pageParam: number = parseInt($page.url.searchParams.get('page') || '0');

		$articleStore.category = categoryParam;
		$articleStore.tag = tagParam;
		$articleStore.search = searchParam;
		$articleStore.sort = sortParam;
		$articleStore.time = timeParam;
		$articleStore.page = pageParam;

		// Set actives based on urlparams
		if (categories.some((x) => x[0] === categoryParam)) {
			document.querySelector('.category-button.active')?.classList.remove('active');
			document.getElementById(`category-button-${categoryParam}`)?.classList.toggle('active');
		}

		if (tags.some((x) => x[0] === tagParam)) {
			document.querySelector('.tag-button.active')?.classList.remove('active');
			document.getElementById(`tag-button-${tagParam}`)?.classList.toggle('active');
		}

		if (sortOptions.some((x) => x[0] === sortParam)) {
			document.querySelector('.sort-button.active')?.classList.remove('active');
			document.getElementById(`sort-button-${sortParam}`)?.classList.toggle('active');
		}

		if (timeOptions.some((x) => x[0] === timeParam)) {
			document.querySelector('.time-button.active')?.classList.remove('active');
			document.getElementById(`time-button-${timeParam}`)?.classList.toggle('active');
		}
	});

	// Reactive filters
	const categories = [
		['cs.ai', 'Artificial Intelligence'],
		['cs.cv', 'Computer Vision'],
		['cs.lg', 'Machine Learning'],
		['cs.cl', 'Natural Language Processing'],
		['cs.ne', 'Neuroevolution']
	];

	const tags = [
		['ensemble', 'Ensemble'],
		['optimization', 'Optimization'],
		['pruning', 'Pruning'],
		['distillation', 'Distillation'],
		['diffusion', 'Diffusion'],
		['generative', 'Generative'],
		['tuning', 'Tuning'],
		['reinforcement', 'Reinforcement'],
		['unsupervised', 'Unsupervised'],
		['supervised', 'Supervised'],
		['classification', 'Classification'],
		['regression', 'Regression'],
		['regularization', 'Regularization'],
		['evolution', 'Evolution'],
		['sparsity', 'Sparsity'],
		['latent', 'Latent'],
		['quantization', 'Quantization'],
		['augmentation', 'Augmentation'],
		['federated', 'Federated'],
		['transfer', 'Tranfer'],
		['attention', 'attention'],
		['bayesian', 'Bayesian'],
		['interpretability', 'Interpretability'],
		['clustering', 'Clustering'],
		['embedding', 'Embedding'],
		['efficient', 'Efficient'],
		['segmentation', 'Segmentation'],
		['theory', 'Theory']
	];

	const sortOptions = [
		['featured', 'Featured'],
		['influential', 'Influential']
		// ['foryou', 'For You']
	];

	const timeOptions = [
		['pastfive', 'Past 5 Years'],
		['pastthree', 'Past 3 Years'],
		['pastyear', 'Past Year'],
		['pastmonth', 'Past Month']
	];

	const handleCategory = (e, category: string) => {
		$page.url.searchParams.set('category', category);
		$page.url.searchParams.set('page', 0);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('category-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.category = category;
		$articleStore.page = 0;
	};

	const handleTag = (e, tag: string) => {
		$page.url.searchParams.set('tag', tag);
		$page.url.searchParams.set('page', 0);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('tag-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.tag = tag;
		$articleStore.page = 0;
	};

	const handleSort = (e, sort: string) => {
		$page.url.searchParams.set('sort', sort);
		$page.url.searchParams.set('page', 0);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('sort-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.sort = sort;
		$articleStore.page = 0;
	};

	const handleTime = (e, time: string) => {
		$page.url.searchParams.set('time', time);
		$page.url.searchParams.set('page', 0);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('time-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.time = time;
		$articleStore.page = 0;
	};

	const handlePaginate = (page) => {
		$page.url.searchParams.set('page', page);
		goto(`?${$page.url.searchParams.toString()}`);
		$articleStore.page = page;
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

<svelte:head>
	<title>Home | Wits End</title>
	<meta
		name="description"
		content="Enhancing the productivity and impact of researchers through an AI-powered web platform that simplifies the management of academic literature."
	/>
</svelte:head>

<div class="wrapper">
	<div class="filters">
		<nav class="categories">
			<button
				class="category-button active"
				id="category-button-all"
				title="All"
				on:click={(e) => {
					handleCategory(e, 'all');
				}}>All</button
			>
			{#each categories as [key, value]}
				<button
					class="category-button"
					id="category-button-{key}"
					title={value}
					on:click={(e) => {
						handleCategory(e, key);
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
			<!-- Search Filter -->

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
						placeholder="Titles, Keywords, Authors and More..."
						bind:value={$articleStore.search}
						on:input={() => {
							$page.url.searchParams.set('search', $articleStore.search);
							$page.url.searchParams.set('page', 0);
							$articleStore.page = 0;

							if ($articleStore.search == '') {
								$page.url.searchParams.delete('search');
							}
						}}
					/>
				</div>
			</div>

			<!-- Sort Filter -->

			<div class="sort">
				<h3 class="minion">Sort</h3>
				<div class="options">
					<div class="group">
						<button
							class="sort-button active"
							id="sort-button-recent"
							title="recent"
							on:click={(e) => {
								handleSort(e, 'recent');
							}}>Recent</button
						>
						{#each sortOptions as [key, value]}
							<button
								class="sort-button"
								id="sort-button-{key}"
								title={value}
								on:click={(e) => {
									handleSort(e, key);
								}}>{value}</button
							>
						{/each}
						<button class="sort-button-disabled">For You</button>
					</div>
					<div class="group">
						<button
							class="time-button active"
							id="time-button-alltime"
							title="All Time"
							on:click={(e) => {
								handleTime(e, 'alltime');
							}}>All Time</button
						>
						{#each timeOptions as [key, value]}
							<button
								class="time-button"
								id="time-button-{key}"
								title={value}
								on:click={(e) => {
									handleTime(e, key);
								}}>{value}</button
							>
						{/each}
					</div>
				</div>
			</div>

			<!-- Tags Filter -->

			<div class="tags">
				<h3 class="minion">Tags</h3>
				<button
					class="tag-button active"
					id="tag-button-all"
					title="All"
					on:click={(e) => {
						handleTag(e, 'all');
					}}>All</button
				>{#each tags as [key, value]}
					<button
						class="tag-button"
						id="tag-button-{key}"
						title={value}
						on:click={(e) => {
							handleTag(e, key);
						}}>{value}</button
					>
				{/each}
			</div>

			<div class="sponsors">
				<h3 class="minion">Sponsors</h3>
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1498186405228029"
					crossorigin="anonymous"
				></script>
				<!-- Sidebar -->
				<ins
					class="adsbygoogle"
					style="display:block"
					data-ad-client="ca-pub-1498186405228029"
					data-ad-slot="3897793383"
					data-ad-format="auto"
					data-full-width-responsive="true"
				></ins>
				<script>
					(adsbygoogle = window.adsbygoogle || []).push({});
				</script>
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
		<button
			class="page-button"
			on:click={() => {
				handlePaginate($articleStore.page + 1);
			}}>Next</button
		>
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
						color: #d33682;
						cursor: pointer;
						font-weight: bold;
					}

					&:before {
						display: block;
						content: attr(title);
						font-weight: bold;
						height: 0;
						overflow: hidden;
						visibility: hidden;
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
					padding-bottom: 2rem;

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
				.sort {
					padding: 1rem 0;

					.options {
						display: flex;
						.group {
							flex: 0 0 50%;
							.sort-button,
							.time-button {
								font-family: 'Open Sans';
								font-size: 1.2rem;
								font-weight: 500;
								text-transform: uppercase;
								text-decoration: none;
								margin-bottom: 0.2rem;
								color: #aaa;
								display: block;
								border: none;
								background: none;

								&.active,
								&:hover {
									color: #d33682;
									cursor: pointer;
									font-weight: bold;
								}
								&:before {
									display: block;
									content: attr(title);
									font-weight: bold;
									height: 0;
									overflow: hidden;
									visibility: hidden;
								}
							}
							.sort-button-disabled {
								font-family: 'Open Sans';
								font-size: 1.2rem;
								font-weight: 500;
								text-transform: uppercase;
								text-decoration: line-through;
								margin-bottom: 0.2rem;
								color: #aaa;
								display: block;
								border: none;
								background: none;
								cursor: text;
							}
						}
					}
				}
				.tags {
					padding: 1rem 0;

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
							color: #d33682;
							cursor: pointer;
							font-weight: bold;
						}

						&:before {
							display: block;
							content: attr(title);
							font-weight: bold;
							height: 0;
							overflow: hidden;
							visibility: hidden;
						}
					}
				}
				.sponsors {
					margin: 2rem 0;
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
