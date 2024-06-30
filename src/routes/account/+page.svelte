<script lang="ts">
	import Highcharts from 'highcharts';
	import { Chart } from '@highcharts/svelte'; // Chart is also exported by default
	import type { PageData } from './$types';
	import FeedCondensed from '$lib/feedCondensed.svelte';
	export let data: PageData;

	let { articles, profile } = data;

	let embeddings = articles.map((article) => {
		return JSON.parse(article.embedding);
	});

	let meanEmbedding = [];
	for (let i = 0; i < embeddings[0].length; i++) {
		let num = 0;
		for (let j = 0; j < embeddings.length; j++) {
			num += embeddings[j][i];
		}
		meanEmbedding.push(num / embeddings.length);
	}

	let allEmbeddings = embeddings.map((e) => {
		return {
			type: 'scatter',
			color: '#aaa',
			opacity: 0.5,
			marker: {
				symbol: 'diamond',
				radius: 3
			},
			data: e
		};
	});

	allEmbeddings.push({
		type: 'column',
		opacity: 1,
		color: '#000000',
		borderColor: '#000000',
		borderRadius: 0,
		data: meanEmbedding
	});

	let options = {
		title: {
			text: ''
		},
		yAxis: {
			title: {
				enabled: false
			}
		},
		xAxis: {
			visible: false
		},
		plotOptions: {
			series: {
				states: {
					hover: {
						enabled: false
					},
					inactive: {
						enabled: false
					}
				}
			}
		},
		tooltip: { enabled: false },
		legend: { enabled: false },
		credits: { enabled: false },
		series: allEmbeddings
	};
</script>

<div class="wrapper">
	<div class="menu">
		<nav class="categories">
			<span class="active">@{profile?.username}</span>
			<span>Settings</span>
		</nav>
	</div>

	<div class="grid">
		<div class="col">
			<div id="chart-container">
				<h2 class="chart-title">Embeddings</h2>
				<Chart {options} highcharts={Highcharts} />
			</div>
			<p>
				All research articles on Wits End are represented with a 256 dimensional vector embedding.
				These embeddings are used to represent article similarity and to make recommendations based
				on the types of research articles you like. The scatter plot and the column chart visualize
				your saved and mean embeddings respectively.
			</p>
		</div>
		<div class="tree col">
			<h3 class="minion">Saved Articles</h3>
			<FeedCondensed {data} />
		</div>
	</div>
</div>

<style lang="scss">
	.menu {
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
		grid-template-columns: 3fr 1fr;
		grid-gap: 2rem;
		margin-top: 2rem;

		.col {
			padding: 1rem;
			padding-left: 0;
			border-right: 1px solid #ddd;

			&:last-child {
				border: none;
			}

			#chart-container {
				margin-left: -1rem;
				margin-bottom: 2rem;

				.chart-title {
					margin-left: 1rem;
					margin-bottom: 1rem;
				}
			}
			.input-group {
				display: flex;
				input {
					padding: 1rem;
					margin: 1rem;
					width: 100%;
				}
			}
			textarea {
				padding: 1rem;
				margin: 1rem;
				margin-right: 2rem;
				width: 100%;
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
