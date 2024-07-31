<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let articleStore;

	onMount(() => {
		let categoryParam = $page.url.searchParams.get('category') || 'all';

		$articleStore.category = categoryParam;

		if (categories.some((x) => x[0] === categoryParam)) {
			document.querySelector('.category-button.active')?.classList.remove('active');
			document.getElementById(`category-button-${categoryParam}`)?.classList.toggle('active');
		}
	});

	const categories = [
		['cs.cv', 'Computer Vision'],
		['cs.lg', 'Machine Learning'],
		['cs.cl', 'Natural Language Processing'],
		['cs.ne', 'Neural Architecture'],
		['cs.ai', 'Ontology']
	];

	const handleCategory = (e, category: string) => {
		$page.url.searchParams.set('category', category);
		$page.url.searchParams.set('page', 0);
		goto(`?${$page.url.searchParams.toString()}`);

		const buttons = document.getElementsByClassName('category-button');

		for (let b of buttons) {
			b.classList.remove('active');
		}

		e.target.classList.toggle('active');
		$articleStore.category = category;
		$articleStore.page = 0;
	};
</script>

<nav class="categories">
	<button
		class="category-button active"
		id="category-button-all"
		title="All"
		on:click={(e) => {
			handleCategory(e, 'all');
		}}>All</button
	>
	{#each categories as [key, value]}
		<button
			class="category-button"
			id="category-button-{key}"
			title={value}
			on:click={(e) => {
				handleCategory(e, key);
			}}>{value}</button
		>
	{/each}
</nav>

<style lang="scss">
	.categories {
		padding-bottom: 2rem;

		.category-button {
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
		@media screen and (max-width: 600px) {
			display: none;
		}
	}
</style>
