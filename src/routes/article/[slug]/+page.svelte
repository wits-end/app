<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ article, user } = data);
</script>

<div class="wrapper">
	<div class="grid">
		<div class="col">
			<p>{article.published_at}</p>
			<h1>{article.title}</h1>
			<p>{article.authors}</p>
			<img src="https://arxiv-sanity-lite.com/static/thumb/2405.14873.jpg" />
			<p>{article.abstract}</p>
			<h3 class="minion">Key Ideas</h3>
			<h3 class="minion">Comments</h3>
			{#if user}
				<form>
					<textarea rows="8" cols="80"></textarea>
					<button>Add Comment</button>
				</form>
			{/if}
			<p style="margin-top:1rem;">Comments are currently disabled.</p>
			<!-- {#each article.comments as comment}
				<p>{comment.profile.username} | 1 hour ago</p>
				<p>{comment.message}</p>
				<p>Reply</p>
			{/each} -->
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

			form {
				button {
					display: block;
					padding: 1rem 2rem;
					margin-top: 1rem;
					background: white;
					border: 1px solid #aaa;
				}
				textarea {
					border: 1px solid #aaa;
				}
			}
		}
	}
</style>
