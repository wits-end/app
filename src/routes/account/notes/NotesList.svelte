<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	dayjs.extend(relativeTime);

	export let data;
	let { notes, profile, session } = data;
	$: ({ notes, profile, session } = data);

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
	{#each notes as note}
		<div
			class="post"
			on:click={() => {
				dispatch('setSelectedNote', {
					note
				});
			}}
		>
			<p class="published-date">
				{dayjs(note?.articles?.published_at).format('YYYY-MM-DD')}
			</p>
			<h2 class="title">{note?.articles?.title}</h2>
			<div class="actions">
				<p class="date">{dayjs().to(dayjs(note?.articles?.published_at))}</p>
				<a class="read-more" href="/article/{note?.articles?.id}">read more</a>
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
			cursor: pointer;

			.published-date {
				font-size: 1.3rem;
				margin: 0;
			}

			h2.title {
				font-family: 'Open Sans';
				font-size: 1.6rem;
				margin-bottom: 0;

				a {
					color: black;
					text-decoration: none;

					&:hover {
						color: #d33682;
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
