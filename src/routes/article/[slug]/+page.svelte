<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { marked } from 'marked';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import FeedCondensed from '$lib/feedCondensed.svelte';
	import dayjs from 'dayjs';

	export let data;
	let { article, relatedArticles } = data;
	$: ({ article, session, profile } = data);

	$: relatedFeedData = {
		articles: relatedArticles,
		savedArticleIds: [],
		session: session,
		profile: profile
	};

	$: isSaved = profile?.articles.some((x) => x.id === article.id) || false;

	const handleSubmit: SubmitFunction = () => {
		isSaved = !isSaved;
	};
</script>

<svelte:head>
	<title>{article?.title} | Wits End</title>
	<meta name="description" content={article?.abstract} />
</svelte:head>

<div class="wrapper">
	{#if session && profile}
		<div class="tools">
			<nav class="actions">
				<!-- <button class="action-button">Comment</button> -->
				{#if isSaved}
					<form method="post" action="?/unsaveArticle" use:enhance={() => handleSubmit()}>
						<input type="hidden" name="articleId" value={article?.id} />
						<button class="action-button" title="Unsave">Unsave</button>
					</form>
				{:else}
					<form method="post" action="?/saveArticle" use:enhance={() => handleSubmit()}>
						<input type="hidden" name="articleId" value={article?.id} />
						<button class="action-button" title="Save">Save</button>
					</form>
				{/if}
				<button class="action-button-disabled">Share</button>
				<button class="action-button-disabled">Report</button>
			</nav>
		</div>
	{/if}
	<div class="grid">
		<div class="col">
			<div class="article">
				<h1 class="title">{article?.title}</h1>
				{#if article?.authors.length > 400}
					<p class="authors">{article?.authors.substr(0, 400)}...</p>
				{:else}
					<p class="authors">{article?.authors}</p>
				{/if}
				<a href="https://arxiv.org/pdf/{article?.arxiv_id}"
					><img class="thumbnail" src={article?.thumb_url} alt="PDF Thumbnail" /></a
				>
				<p><b>Abstract:</b> {article?.abstract}</p>
				{#if article?.synopsis}
					<div class="synopsis">
						<h3 class="minion">Synopsis</h3>

						{@html marked(article?.synopsis)}
					</div>
				{/if}

				<!-- <div class="comments">
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
				{/each}
				</div>-->
			</div>
		</div>
		<div class="col">
			<div class="meta">
				<h3 class="minion">Meta</h3>
				<p>Published: {dayjs(article?.published_at).format('YYYY-MM-DD')}</p>
				<p>Updated: {dayjs(article?.updated_at).format('YYYY-MM-DD')}</p>
				<p>
					URL: <a href={'https://arxiv.org/abs/' + article?.arxiv_id}
						>{'https://arxiv.org/abs/' + article?.arxiv_id}</a
					>
				</p>
				<p>Authors: {article?.authors}</p>
				<p>Citations: {article?.citations}</p>
				<p>H Index: {article?.h_index}</p>
				<p>Categories: {article?.categories}</p>
				<p>Model: {article?.model_id}</p>
			</div>
			<div class="related">
				<h3 class="minion">Related</h3>
				<FeedCondensed data={relatedFeedData} />
			</div>
			<!-- <div class="ads">
				<h3 class="minion">Ads</h3>
			</div> -->
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
	.wrapper {
		.tools {
			border-bottom: 1px solid #ddd;
			margin-bottom: 2rem;

			.actions {
				padding-bottom: 2rem;

				form {
					display: inline-block;
				}

				.action-button {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: none;
					margin-right: 2rem;
					color: #aaa;
					background: none;
					border: none;

					&.active,
					&:hover {
						color: #d33682;
						font-weight: bold;
						cursor: pointer;
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
				.action-button-disabled {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: line-through;
					margin-right: 2rem;
					color: #aaa;
					display: inline-block;
					border: none;
					background: none;
					cursor: text;
				}
			}
		}

		.grid {
			display: grid;
			grid-template-rows: auto;
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
					.authors {
						font-size: 1.4rem;
					}
					.title {
						font-family: 'Open Sans';
						font-size: 3.2rem;
						line-height: 1.25;
					}
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

					.synopsis {
						margin-top: 2rem;
						:global(p) {
							font-size: 1.8rem;
						}

						:global(h2) {
							font-family: 'Open Sans';
						}
						:global(h3) {
							font-family: 'Open Sans';
						}
					}

					.comments {
						textarea {
							margin-bottom: 1rem;
							background: white;
							border: 1px solid #ddd;
							padding: 1rem;
						}
						button {
							display: block;
							background: white;
							border: 1px solid #ddd;
							padding: 1rem 2rem;
							transition: all 0.2s ease;

							&:hover {
								border: 1px solid #666;
							}
						}
					}
				}

				.meta {
					font-size: 1.4rem;
					margin-bottom: 2rem;
					p {
						margin-bottom: 0;
					}
				}
			}
		}
	}
</style>
