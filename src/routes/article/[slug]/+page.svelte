<script>
	/** @type {import('./$types').PageData} */
	import { marked } from 'marked';
	import FeedCondensed from '$lib/feedCondensed.svelte';
	import FeedVerbose from '$lib/feedVerbose.svelte';
	import Layout from '../../+layout.svelte';
	import { REALTIME_PRESENCE_LISTEN_EVENTS } from '@supabase/supabase-js';

	export let data;

	$: ({ article, relatedArticles, session } = data);

	$: relatedFeedData = {
		articles: relatedArticles,
		savedArticleIds: [],
		session: session
	};
</script>

<div class="wrapper">
	<div class="grid">
		<div class="col">
			<div class="article">
				<h1>{article?.title}</h1>
				<p><small>{article?.authors}</small></p>
				<img class="thumbnail" src={article?.thumb_url} alt="PDF Thumbnail" />
				<p><b>Abstract:</b> {article?.abstract}</p>
				{#if article?.synopsis}
					<div class="ai">
						{@html marked(article?.synopsis)}
					</div>
				{/if}
				<h3 class="minion">Comments</h3>
				{#if session}
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
		</div>
		<div class="col">
			<div class="meta">
				<h3 class="minion">Meta</h3>
				<p>
					URL: <a href={'https://arxiv.org/abs/' + article?.arxiv_id}
						>{'https://arxiv.org/abs/' + article?.arxiv_id}</a
					>
				</p>
				<p>Published: {article?.published_at}</p>
				<p>Updated: {article?.updated_at}</p>
				<p>Authors: {article?.authors}</p>
				<p>Categories: {article?.categories}</p>
				<p>Keywords: {article?.keywords}</p>
			</div>
			<div class="meta">
				<h3 class="minion">Model</h3>
				<p>Name: {article?.model_id}</p>
				<p>Updated: {article?.model_updated_at}</p>
			</div>
			<div class="related">
				<h3 class="minion">Related</h3>
				<FeedCondensed data={relatedFeedData} />
			</div>
		</div>
	</div>
	<script
		type="text/javascript"
		id="MathJax-script"
		async
		src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
	></script>
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

			.article {
				.thumbnail {
					max-width: 100%;
					width: 100%;
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

				.ai {
					:global(h2) {
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
