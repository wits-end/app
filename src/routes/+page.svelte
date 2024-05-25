<script lang="ts">
	export let data;
	$: ({ articles } = data);

	let tags = [
		'all',
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
			<div class="feed">
				{#each articles as article}
					<div class="post">
						<small class="date">{article.published_at}</small>
						<small class="categories">{article.subjects}</small>
						<h1 class="title">{article.title}</h1>
						<p class="description">{article.abstract.substr(0, 500)}</p>
						<a href="/article/{article.id}">Read More</a>
					</div>
				{/each}
			</div>
		</div>
		<div class="recent col">
			<div class="feed">
				{#each articles as article}
					<div class="post">
						<small class="date">{article.published_at}</small>
						<small class="categories">{article.subjects}</small>
						<h2 class="title">{article.title}</h2>
						<!-- <p class="description">{article.abstract}</p> -->
						<a href="/article/{article.id}">Read More</a>
					</div>
				{/each}
			</div>
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
					<input type="text" placeholder="Articles, Datasets, Research and more..." />
				</div>
			</div>
			<div class="sort">
				<h3 class="minion">Sort</h3>
				<div class="options">
					<div class="group">
						<span class="active">Top</span>
						<span>Recent</span>
						<span>Impactful</span>
						<span>Featured</span>
					</div>
					<div class="group">
						<span class="active">All Time</span>
						<span>Past Year</span>
						<span>Past Month</span>
						<span>Past Week</span>
					</div>
				</div>
			</div>
			<div class="tags">
				<h3 class="minion">Tags</h3>
				{#each tags as tag}
					<span class="tag">{tag}</span>
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

				h2 {
					display: inline-block;
					font-size: 1.2rem;
					font-family: 'Open Sans';
					text-transform: uppercase;
					margin-right: 2rem;
				}
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

				.feed {
					.post {
						background: white;
						padding: 2rem 0;
						margin-right: 2rem;
						border-bottom: 1px solid #ddd;

						.categories {
							display: none;
						}
						h1.title {
							font-family: 'Open Sans';
							font-size: 2.4rem;
						}
						h2.title {
							font-family: 'Open Sans';
							font-size: 1.6rem;
						}
						.description {
							font-size: 1.6rem;
						}
						&:last-child {
							border: none;
						}

						&:first-child {
							padding-top: 0;
						}
					}
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
						}
					}
				}

				.sort {
					padding: 2rem 0;

					.options {
						display: flex;
						.group {
							flex: 0 0 50%;
							span {
								font-family: 'Open Sans';
								font-size: 1.2rem;
								font-weight: 500;
								text-transform: uppercase;
								text-decoration: none;
								margin-bottom: 0.2rem;
								color: #aaa;
								display: block;

								&.active,
								&:hover {
									color: red;
									cursor: pointer;
								}
							}
						}
					}
				}

				.tags {
					padding: 2rem 0;

					span {
						font-family: 'Open Sans';
						font-size: 1.2rem;
						font-weight: 500;
						text-transform: uppercase;
						text-decoration: none;
						margin-bottom: 0.2rem;
						margin-right: 0.5rem;
						color: #aaa;
						display: inline-block;

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
