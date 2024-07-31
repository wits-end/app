<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	export let articleStore;

	onMount(() => {
		let searchParam = $page.url.searchParams.get('search') || '';

		$articleStore.search = searchParam;
	});
</script>

<div class="search">
	<h3 class="minion">Search</h3>
	<div class="field-group">
		<div class="icon">
			<svg
				aria-hidden="true"
				data-prefix="fas"
				data-icon="search"
				class="svg-inline--fa fa-search fa-w-16"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<path
					fill="currentColor"
					d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
				/>
			</svg>
		</div>
		<input
			type="text"
			placeholder="Titles, Keywords, Arxiv IDs, Authors and More..."
			bind:value={$articleStore.search}
			on:input={() => {
				$page.url.searchParams.set('search', $articleStore.search);
				$page.url.searchParams.set('page', 0);
				$articleStore.page = 0;

				if ($articleStore.search == '') {
					$page.url.searchParams.delete('search');
				}
			}}
		/>
	</div>
</div>

<style lang="scss">
	.search {
		padding-bottom: 2rem;

		.field-group {
			position: relative;
			width: 100%;

			.icon {
				position: absolute;
				left: 1rem;
				top: 50%;
				transform: translateY(-50%);
				width: 1.5rem;
				color: #0004;
			}
			input {
				width: 100%;
				background: white;
				padding: 1.5rem;
				color: #0008;
				border: 1px solid #ddd;
				padding-left: 3.5rem;
				font-family: 'Open Sans';
			}
		}
	}
</style>
