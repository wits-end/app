<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';

	dayjs.extend(relativeTime);

	export let data;
	$: ({ articles, savedArticleIds, user, supabase } = data);

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
    {#each articles.slice(0, 3) as article}
        <div class="post">
            <p class="published-date">
                {new Date(article.created_at).toLocaleDateString()}
            </p>
            <small class="categories">{article.subjects}</small>
            <h1 class="title"><a href="/article/{article.id}">{article.title}</a></h1>
            <p class="authors">{article.authors}</p>
            <img src="https://arxiv-sanity-lite.com/static/thumb/2405.14873.jpg" />
            <p class="description">{article.summary.substr(0, 500)}...</p>
            <div class="actions">
                <p class="date">updated {dayjs().to(dayjs(article.updated_at))}</p>
                <a class="read-more" href="/article/{article.id}">read more</a>
                {#if user}
                    {#if savedArticleIds?.includes(article.id)}
                        <form
                            method="post"
                            action="?/unsaveArticle"
                            use:enhance={() => handleSubmit(article.id)}
                        >
                            <input type="hidden" name="articleId" value={article.id} />
                            <button>unsave article</button>
                        </form>
                    {:else}
                        <form
                            method="post"
                            action="?/saveArticle"
                            use:enhance={() => handleSubmit(article.id)}
                        >
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
							margin-bottom: 0.5rem;
						}
						.categories {
							display: none;
						}
						h1.title {
							font-family: 'Open Sans';
							font-size: 2.4rem;

							a {
								color: black;
								text-decoration: none;

								&:hover {
									color: red;
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
								border-right: 1px solid #ddd;
								padding-right: 1rem;
								padding-bottom: 0.25rem;
							}
							.read-more,
							form {
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
									font-size: 1.4rem;
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