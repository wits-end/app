<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { marked } from 'marked';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { isPremium } from '$lib/utils/subscriptions.js';
	import Tooltip from '$lib/components/tooltip.svelte';
	import FeedCondensed from '$lib/components/feedCondensed.svelte';
	import Tiptap from '$lib/components/tiptap.svelte';
	import dayjs from 'dayjs';
	import FigureModal from '$lib/components/figureModal.svelte';

	export let data;
	let showModal = false;
	let figureCaption;
	let figureUrl;

	let { article, note, relatedArticles } = data;

	$: ({ article, figures, note, relatedArticles, session, profile } = data);

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

<FigureModal bind:showModal>
	<figure>
		<img src={figureUrl} alt={figureCaption} />
		<figcaption>
			<p>{figureCaption}</p>
		</figcaption>
	</figure>
</FigureModal>

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

				<!-- {#if article?.authors.length > 400}
					<p class="authors">{article?.authors.substr(0, 400)}...</p>
				{:else}
					<p class="authors">{article?.authors}</p>
				{/if} -->
				<a class="thumbnail" href="https://arxiv.org/pdf/{article?.arxiv_id}"
					><img src={article?.thumb_url} alt="PDF Thumbnail" /></a
				>
				<!-- <p>
					<b>PDF: </b>
					<a href={'https://arxiv.org/pdf/' + article?.arxiv_id + '.pdf'}
						>{'https://arxiv.org/pdf/' + article?.arxiv_id + '.pdf'}</a
					>
				</p> -->
				<p><b>Abstract:</b> {article?.abstract}</p>

				<div class="figures">
					<h3 class="minion">Figures</h3>

					<div class="gallery">
						{#each figures as figure_object}
							{#if figure_object.figType == 'Figure'}
								<div
									class="item"
									on:click={() => {
										showModal = true;
										figureCaption = figure_object.caption;
										figureUrl = figure_object.renderURL;
									}}
								>
									<img src={figure_object.renderURL} alt="" />
								</div>
							{/if}
						{/each}
					</div>
				</div>
				{#if article?.synopsis}
					<div class="synopsis">
						<h3 class="minion">Synopsis</h3>

						{@html marked(article?.synopsis)}
					</div>
				{/if}

				<div class="notes">
					<h3 class="minion">Notes</h3>
					{#if isPremium(profile)}
						{#key article?.id}
							<Tiptap {note} articleId={article?.id} isEnabled={true} />
						{/key}
					{:else}
						<Tooltip title="premium feature disabled">
							<Tiptap {note} articleId={article?.id} isEnabled={false} />
						</Tooltip>
					{/if}
				</div>
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
						margin-bottom: 2rem;
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

					.figures {
						margin-top: 4rem;
						.thumbnail {
							display: block;
							margin: 2rem 0;

							img {
								max-width: 100%;
								width: 100%;
							}
						}
						.gallery {
							display: grid;
							grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
							grid-gap: 2rem;

							.item {
								display: block;
								border: 1px solid #ddd;
								padding: 1rem;
								aspect-ratio: 1/1;
								cursor: pointer;

								img {
									object-fit: cover;
									width: 100%;
									height: 100%;
								}
							}
						}
					}

					.synopsis {
						margin-top: 4rem;

						:global(p) {
							font-size: 1.6rem;
						}
						:global(li) {
							font-size: 1.6rem;
						}

						:global(h2) {
							font-family: 'Open Sans';
						}
						:global(h3) {
							font-family: 'Open Sans';
						}
					}

					.notes {
						margin-top: 4rem;
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
