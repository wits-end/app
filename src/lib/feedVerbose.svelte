<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';

	dayjs.extend(relativeTime);

	export let data;
	let { articles, profile, session } = data;
	$: ({ articles, profile, session } = data);

	let savedArticleIds = [];

	if (profile?.articles) {
		savedArticleIds = profile.articles.map((x) => x.id);
	}

	const handleSubmit: SubmitFunction = (articleId) => {
		if (savedArticleIds.includes(articleId)) {
			savedArticleIds.splice(savedArticleIds.indexOf(articleId), 1);
		} else {
			savedArticleIds.push(articleId);
		}

		savedArticleIds = savedArticleIds;
	};
</script>

<div class="feed">
	{#each articles as article}
		<div class="post">
			<p class="published-date">
				{dayjs(article.published_at).format('YYYY-MM-DD')}
			</p>
			<h1 class="title"><a href="/article/{article.id}">{article.title}</a></h1>
			<p class="authors">
				{article.authors.substr(0, 200)}{article.authors.length > 200 ? '...' : ''}
			</p>
			<img src={article.thumb_url} alt="PDF Thumbnail" />
			<p class="description">{article.abstract.substr(0, 500)}...</p>
			<div class="actions">
				<p class="date">published {dayjs().to(dayjs(article.published_at))}</p>
				<a class="read-more" href="/article/{article.id}">read more</a>
				{#if session && profile}
					{#if savedArticleIds?.includes(article?.id)}
						<form
							method="post"
							action="?/unsaveArticle"
							use:enhance={() => handleSubmit(article.id)}
						>
							<input type="hidden" name="articleId" value={article.id} />
							<button>unsave article</button>
						</form>
					{:else}
						<form method="post" action="?/saveArticle" use:enhance={() => handleSubmit(article.id)}>
							<input type="hidden" name="articleId" value={article.id} />
							<button>save article</button>
						</form>
					{/if}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.feed {
		.post {
			background: white;
			padding: 2rem 0;
			margin-right: 2rem;
			border-bottom: 1px solid #ddd;

			.published-date {
				font-size: 1.3rem;
				margin: 0;
			}
			.authors {
				font-size: 1.3rem;
				margin-bottom: 1rem;
			}
			h1.title {
				font-family: 'Open Sans';
				font-size: 2.4rem;
				line-height: 1.25;
				a {
					color: black;
					text-decoration: none;

					&:hover {
						color: #d33682;
					}
				}
			}
			.description {
				font-size: 1.6rem;
			}

			.actions {
				font-size: 0;
				p {
					display: inline-block;
					font-size: 1.4rem;
					margin: 0;
				}
				a {
					font-size: 1.4rem;
				}
				.date,
				.read-more {
					padding-right: 1rem;
					padding-bottom: 0.25rem;
				}
				.read-more,
				form {
					border-left: 1px solid #ddd;
					padding-left: 1rem;
					padding-bottom: 0.25rem;
				}
				form {
					display: inline-block;

					button {
						background: none;
						border: none;
						color: #d33682;
						text-decoration: underline;
						font-size: 1.4rem;

						&:hover {
							color: #410e27;
						}
					}
				}
			}
			&:last-child {
				border: none;
			}

			&:first-child {
				padding-top: 0;
			}
		}
	}
</style>
