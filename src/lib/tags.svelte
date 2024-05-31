<script lang="ts">
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

<div class="tags">
	<h3 class="minion">Tags</h3>
	{#each tags as tag}
		<span class="tag">{tag}</span>
	{/each}
</div>

<style lang="scss">
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
</style>
