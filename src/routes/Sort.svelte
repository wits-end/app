<script lang="ts">
	import Tooltip from '$lib/components/tooltip.svelte';
	import { isPremium } from '$lib/utils/subscriptions';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let articleStore;
	export let profile;

	onMount(() => {
		let sortParam = $page.url.searchParams.get('sort') || 'featured';
		let timeParam = $page.url.searchParams.get('time') || 'alltime';

		// if (sortParam == 'foryou' && !isPremium(profile)) {
		// 	sortParam = 'featured';
		// 	$page.url.searchParams.delete('sort');
		// 	goto(`?${$page.url.searchParams.toString()}`);
		// }

		$articleStore.sort = sortParam;
		$articleStore.time = timeParam;

		if (sortOptions.some((x) => x[0] === sortParam || sortParam === 'foryou')) {
			document.querySelector('.sort-button.active')?.classList.remove('active');
			document.getElementById(`sort-button-${sortParam}`)?.classList.toggle('active');
		}

		if (timeOptions.some((x) => x[0] === timeParam)) {
			document.querySelector('.time-button.active')?.classList.remove('active');
			document.getElementById(`time-button-${timeParam}`)?.classList.toggle('active');
		}
	});

	const sortOptions = [
		['influential', 'Influential'],
		['recent', 'Recent']
	];

	const timeOptions = [
		['pastfive', 'Past 5 Years'],
		['pastthree', 'Past 3 Years'],
		['pastyear', 'Past Year']
	];

	const handleSort = (e, sort: string) => {
		$page.url.searchParams.set('sort', sort);
		$page.url.searchParams.set('page', 0);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('sort-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.sort = sort;
		$articleStore.page = 0;
	};

	const handleTime = (e, time: string) => {
		$page.url.searchParams.set('time', time);
		$page.url.searchParams.set('page', 0);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('time-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.time = time;
		$articleStore.page = 0;
	};
</script>

<div class="sort">
	<h3 class="minion">Sort</h3>
	<div class="options">
		<div class="group">
			{#if isPremium(profile)}
				<button
					class="sort-button"
					id="sort-button-foryou"
					title="For You"
					on:click={(e) => {
						handleSort(e, 'foryou');
					}}>For You</button
				>
			{:else}
				<Tooltip title="premium feature disabled">
					<button class="sort-button-disabled">For You</button>
				</Tooltip>
			{/if}
			<button
				class="sort-button active"
				id="sort-button-featured"
				title="Featured"
				on:click={(e) => {
					handleSort(e, 'featured');
				}}>Featured</button
			>
			{#each sortOptions as [key, value]}
				<button
					class="sort-button"
					id="sort-button-{key}"
					title={value}
					on:click={(e) => {
						handleSort(e, key);
					}}>{value}</button
				>
			{/each}
		</div>
		<div class="group">
			<button
				class="time-button active"
				id="time-button-alltime"
				title="All Time"
				on:click={(e) => {
					handleTime(e, 'alltime');
				}}>All Time</button
			>
			{#each timeOptions as [key, value]}
				<button
					class="time-button"
					id="time-button-{key}"
					title={value}
					on:click={(e) => {
						handleTime(e, key);
					}}>{value}</button
				>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.sort {
		padding: 1rem 0;

		.options {
			display: flex;
			.group {
				flex: 0 0 50%;
				.sort-button,
				.time-button {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: none;
					margin-bottom: 0.2rem;
					color: #aaa;
					display: block;
					border: none;
					background: none;

					&.active,
					&:hover {
						color: #d33682;
						cursor: pointer;
						font-weight: bold;
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
				.sort-button-disabled {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: line-through;
					margin-bottom: 0.2rem;
					color: #aaa;
					display: block;
					border: none;
					background: none;
					cursor: text;
				}
			}
		}
	}
</style>
