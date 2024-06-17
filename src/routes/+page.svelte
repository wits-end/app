<script lang="ts">
	import FeedVerbose from '$lib/feedVerbose.svelte';
	import FeedCondensed from '$lib/feedCondensed.svelte';
	import Search from '$lib/search.svelte';
	import Sort from '$lib/sort.svelte';
	import Tags from '$lib/tags.svelte';

	export let data;
	let { articles, profile, session } = data;
	// $: ({ articles, profile, user } = data);

	let savedArticleIds = [];

	if (profile?.articles) {
		savedArticleIds = profile.articles.map((x) => x.id);
	}

	let featuredFeedData = {
		articles: articles.slice(0, 3),
		savedArticleIds: savedArticleIds,
		session: session
	};

	let condensedFeedData = {
		articles: articles.slice(3),
		savedArticleIds: savedArticleIds,
		session: session
	};
</script>

<div class="wrapper">
	<div class="filters">
		<nav class="categories">
			<span class="active">All</span>
			<span>cs.AI</span>
			<span>cs.CL</span>
			<span>cs.CV</span>
			<span>cs.LG</span>
			<span>cs.NE</span>
			<span>stat.ML</span>
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
			<Search />
			<Sort />
			<Tags />
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		.filters {
			border-bottom: 1px solid #ddd;

			.categories {
				padding-bottom: 2rem;

				span {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: none;
					margin-right: 2rem;
					color: #aaa;

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
			}
		}
	}
</style>
