<script lang="ts">
	import Highcharts from 'highcharts';
	import { Chart } from '@highcharts/svelte'; // Chart is also exported by default
	import type { PageData } from './$types';
	import FeedCondensed from '$lib/feedCondensed.svelte';

	export let data: PageData;

	let { articles, profile } = data;

	let folders = [
		{
			label: 'Saved Articles',
			isExpanded: true,
			children: []
		}
	];

	let toggleExpansion = (folder) => {
		folder.isExpanded = !folder.isExpanded;
		folders = folders;
	};

	// let embeddings = articles.map((article) => {
	// 	return {
	// 		type: 'line',
	// 		data: JSON.parse(article.embedding),
	// 		opacity: 0.2
	// 	};
	// });

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

	let maxEmbedding = [];
	let minEmbedding = [];
	for (let i = 0; i < embeddings[0].length; i++) {
		let max = 0;
		let min = 0;
		for (let j = 0; j < embeddings.length; j++) {
			if (embeddings[j][i] > max) {
				max = embeddings[j][i];
			}
			if (embeddings[j][i] < min) {
				min = embeddings[j][i];
			}
		}
		maxEmbedding.push(max);
		minEmbedding.push(min);
	}

	// embeddings.push({
	// 	type: 'column',
	// 	data: meanEmbedding,
	// 	color: 'black',
	// 	opacity: 0.8,
	// 	plotOptions: {
	// 		column: {
	// 			pointWidth: 20
	// 		}
	// 	}
	// });

	let allEmbeddings = embeddings.map((e) => {
		return {
			type: 'scatter',
			color: '#ddd',
			opacity: 1,
			marker: {
				symbol: 'diamond',
				radius: 2
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

	// allEmbeddings.push({
	// 	type: 'areaspline',
	// 	data: minEmbedding,
	// 	color: '#dddddd',
	// 	opacity: 0.25
	// });
	// allEmbeddings.push({
	// 	type: 'areaspline',
	// 	data: maxEmbedding,
	// 	color: '#dddddd',
	// 	opacity: 0.25
	// });

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
			<span class="active">{profile?.username}</span>
			<span>Settings</span>
		</nav>
	</div>

	<div class="grid">
		<div class="col">
			<div id="chart-container">
				<Chart {options} highcharts={Highcharts} />
			</div>
		</div>
		<div class="tree col">
			{#each folders as folder}
				<h3 class="minion" on:click={() => toggleExpansion(folder)}>
					{folder.isExpanded ? '\u25BE' : '\u25B8'}
					{folder.label}
				</h3>

				{#if folder.isExpanded}
					<FeedCondensed {data} />
				{/if}
			{/each}
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
