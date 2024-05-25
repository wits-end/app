<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ article, user } = data);
</script>

<div class="wrapper">
	<div class="grid">
		<div class="col">
			<h1>{article.title}</h1>
			<p>Content</p>
			<h3 class="minion">Comments</h3>
			{#if user}
				<form>
					<textarea></textarea>
					<button>Submit</button>
				</form>
			{/if}
		</div>
		<div class="col">
			<h3 class="minion">Meta</h3>
		</div>
	</div>
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: 3fr 1fr;
		grid-gap: 2rem;

		.col {
			padding: 1rem;
			padding-left: 0;
			border-right: 1px solid #ddd;

			&:last-child {
				border: none;
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
		}
	}
</style>
