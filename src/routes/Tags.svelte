<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let articleStore;

	onMount(() => {
		let tagParam = $page.url.searchParams.get('tag') || 'all';

		$articleStore.tag = tagParam;

		if (tags.some((x) => x === tagParam)) {
			document.querySelector('.tag-button.active')?.classList.remove('active');
			document.getElementById(`tag-button-${tagParam}`)?.classList.toggle('active');
		}
	});

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
</script>

<div class="tags">
	<h3 class="minion">Tags</h3>
	<button
		class="tag-button active"
		id="tag-button-all"
		title="All"
		on:click={(e) => {
			handleTag(e, 'all');
		}}>All</button
	>{#each tags as tag}
		<button
			class="tag-button"
			id="tag-button-{tag}"
			title={tag}
			on:click={(e) => {
				handleTag(e, tag);
			}}>{tag}</button
		>
	{/each}
</div>

<style lang="scss">
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
</style>
