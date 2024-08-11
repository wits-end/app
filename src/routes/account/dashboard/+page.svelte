<script lang="ts">
	import { enhance } from '$app/forms';
	import Highcharts from 'highcharts';
	import { Chart } from '@highcharts/svelte'; // Chart is also exported by default
	import type { PageData } from '../$types';
	import FeedCondensed from '$lib/components/feedCondensed.svelte';
	import FeedVerbose from '$lib/components/feedVerbose.svelte';
	import { isPremium } from '$lib/utils/subscriptions';
	import Loading from '$lib/components/icons/loading.svelte';
	import { page } from '$app/stores';
	import AccountMenu from '$lib/components/AccountMenu.svelte';

	export let data: PageData;

	let { savedArticles, recommendedArticles, profile, activity } = data;
	$: ({ activity } = data);

	let pending = false;

	let embeddings = savedArticles.map((article) => {
		return JSON.parse(article.embedding);
	});
</script>

<svelte:head>
	<title>Dashboard | Dead Neuron</title>
	<meta
		name="description"
		content="Personal AI notebook dashboard. View your embedding fingerprint, saved articles, and personal info."
	/>
</svelte:head>

<div class="wrapper">
	<AccountMenu {profile} />

	<div class="grid">
		<div class="col">
			<div class="personal-info">
				<h3 class="minion">Personal Info</h3>
				<p>supporter: {isPremium(profile)}</p>
				<p>username: {profile?.username}</p>
				<p>email: {profile?.email}</p>

				<form
					method="post"
					action="?/saveProfile"
					use:enhance={() => {
						pending = true;
						return async ({ update }) => {
							await update({ reset: false });
							pending = false;
						};
					}}
				>
					<div class="input-group">
						<div>
							<label for="first_name">first name</label>
							<input placeholder="first name" name="first_name" value={profile?.first_name} />
						</div>
						<div>
							<label for="last_name">last name</label>
							<input placeholder="last name" name="last_name" value={profile?.last_name} />
						</div>
					</div>
					<label for="bio">bio</label>
					<textarea
						placeholder="Research, Summary, Bio, etc..."
						name="bio"
						rows="8"
						value={profile?.bio}
					/>

					<button>Save</button>
					{#if pending}
						<div class="loading"><Loading /></div>
					{:else if $page.form?.success}
						<p>profile saved</p>
					{/if}
				</form>
			</div>

			<div class="activity">
				<h3 class="minion">Recent Activity</h3>
				<table>
					<thead>
						<tr>
							<th>Event</th>
						</tr>
					</thead>
					{#each activity.slice(0, 25) as event}
						<tr>
							<td>{event.message}</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
		<div class="col">
			<div class="activity">
				<h3 class="minion">Featured Recommendations</h3>
				<div class="embeddings">
					<!-- <p>
						All research articles on Wits End are represented with vector embeddings. These are used
						to measure article similarity so that we can make recommendations for new papers
						applicable to your interests. The following graph is a visualization of your unique
						embedding fingerprint as a scatterplot of all the embeddings of the research articles
						you have saved. {#if isPremium(profile)}
							Check out your <a href="/?sort=foryou">recommended articles</a> here.
						{/if}
					</p> -->
					{#if recommendedArticles.length}
						<!-- <div id="chart-container">
							<Chart {options} highcharts={Highcharts} />
						</div> -->

						<FeedVerbose articles={recommendedArticles} {profile} />
					{:else}
						<p>
							If you don't see any graph here, try saving some articles to get a visualization of
							your profile's fingerprint.
						</p>
					{/if}
				</div>
			</div>
		</div>
		<div class="tree col">
			<h3 class="minion">Saved Articles</h3>
			<FeedCondensed articles={savedArticles} {profile} />
		</div>
	</div>
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: 1fr 2fr 1fr;
		grid-gap: 2rem;

		.col {
			padding: 1rem 2rem 1rem 0;
			border-right: 1px solid #ddd;

			&:last-child {
				border: none;
				padding-right: 0;
			}

			.personal-info {
				margin-bottom: 2rem;
				p {
					margin: 0;
				}
				form {
					margin-top: 2rem;
					.input-group {
						display: grid;
						grid-template-columns: 1fr 1fr;
						grid-gap: 2rem;
						margin-bottom: 2rem;

						input {
							padding: 1rem;
							width: 100%;
							border: 1px solid #aaa;
						}
					}
					textarea {
						width: 100%;
						padding: 1rem;
						border: 1px solid #aaa;
						margin-bottom: 2rem;
					}
					button {
						font-family: 'Open Sans';
						font-size: 1.2rem;
						font-weight: 500;
						text-transform: uppercase;
						text-decoration: none;
						background: white;
						border: 1px solid #ddd;
						color: #999;
						padding: 1rem 2rem;
						transition: all 0.2s ease;

						&:hover {
							border: 1px solid #666;
							color: #000;
						}
					}
					.loading {
						margin-top: 1rem;
					}
				}
			}
			.embeddings {
				margin-bottom: 2rem;
				#chart-container {
					margin-left: -1rem;
					margin-bottom: 2rem;

					.chart-title {
						margin-left: 1rem;
						margin-bottom: 1rem;
					}
				}
			}

			.activity {
				table {
					width: 100%;
					border-collapse: collapse;
					font-size: 1.4rem;

					thead {
						text-align: left;
						border: 1px solid #ddd;
					}
					tr {
						border: 1px solid #ddd;
					}
					td,
					th {
						padding: 0.5rem;
					}
				}
			}
		}

		.tree {
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
