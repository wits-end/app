<script>
	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ article, user } = data);
</script>

<div class="wrapper">
	<div class="grid">
		<div class="col">
			<h1>{article.title}</h1>
			<img src="https://arxiv-sanity-lite.com/static/thumb/2405.14873.jpg" />
			<p>{article.summary}</p>
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
			<div class="meta">
				<h3 class="minion">Meta</h3>
				<p>Published: {article.published_at}</p>
				<p>Updated: {article.updated_at}</p>
				<p>Authors: {article.authors}</p>
				<p>Categories: {article.categories}</p>
				<p>Keywords: {article.keywords}</p>
			</div>
			<div class="related">
				<h3 class="minion">Related</h3>
			</div>
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

			.meta {
				margin-bottom: 2rem;
				p {
					margin-bottom: 0;
				}
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
