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
				{dayjs(article?.published_at).format('YYYY-MM-DD')}
			</p>
			<h2 class="title"><a href="/article/{article?.id}">{article?.title}</a></h2>
			<div class="actions">
				<p class="date">{dayjs().to(dayjs(article?.published_at))}</p>
				<a class="read-more" href="/article/{article?.id}">read more</a>
				{#if session}
					{#if savedArticleIds?.includes(article?.id)}
						<form
							method="post"
							action="?/unsaveArticle"
							use:enhance={() => handleSubmit(article?.id)}
						>
							<input type="hidden" name="articleId" value={article?.id} />
							<button>unsave article</button>
						</form>
					{:else}
						<form method="post" action="?/saveArticle" use:enhance={() => handleSubmit(article.id)}>
							<input type="hidden" name="articleId" value={article?.id} />
							<button>save article</button>
						</form>
					{/if}
				{/if}
			</div>
			<!-- <p>
				<small
					>c: {article.citations} | h: {article.h_index}</small
				>
			</p> -->
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

			h2.title {
				font-family: 'Open Sans';
				font-size: 1.6rem;

				a {
					color: black;
					text-decoration: none;

					&:hover {
						color: red;
					}
				}
			}

			.actions {
				font-size: 0;
				p {
					display: inline-block;
					font-size: 1.2rem;
					margin: 0;
				}
				a {
					font-size: 1.2rem;
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
						color: red;
						text-decoration: underline;
						font-size: 1.2rem;
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
