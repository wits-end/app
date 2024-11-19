<script>
	import { page } from '$app/stores';
	import { isPremium } from '$lib/utils/subscriptions';
	import Tooltip from '$lib/components/tooltip.svelte';

	export let profile;
</script>

<div class="menu">
	<nav class="categories">
		<a
			href="/account/dashboard"
			class:active={$page.url.pathname === '/account/dashboard'}
			title="Dashboard">Dashboard</a
		>
		{#if isPremium(profile)}
			<!-- <a
				href="/account/billing"
				class:active={$page.url.pathname === '/account/billing'}
				title="billing">Billing</a
			> -->
			<a href="/account/lists" class:active={$page.url.pathname === '/account/lists'} title="lists"
				>Lists</a
			>
			<a href="/account/notes" class:active={$page.url.pathname === '/account/notes'} title="notes"
				>Notes</a
			>
		{:else}
			<!-- <div class="disabled-wrap">
				<Tooltip title="premium feature disabled">
					<span class="navigation-disabled">Billing</span>
				</Tooltip>
			</div> -->
			<div class="disabled-wrap">
				<Tooltip title="premium feature disabled">
					<span class="navigation-disabled">Lists</span>
				</Tooltip>
			</div>
			<div class="disabled-wrap">
				<Tooltip title="premium feature disabled">
					<span class="navigation-disabled">Notes</span>
				</Tooltip>
			</div>
		{/if}
	</nav>
</div>

<style lang="scss">
	.menu {
		border-bottom: 1px solid #ddd;
		margin-bottom: 2rem;

		.categories {
			padding-bottom: 2rem;
			a {
				font-family: 'Open Sans';
				font-size: 1.2rem;
				font-weight: 500;
				text-transform: uppercase;
				text-decoration: none;
				margin-right: 2rem;
				color: #aaa;
				background: none;
				border: none;
				display: inline-block;

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
			.disabled-wrap {
				display: inline-block;
				margin-right: 2rem;

				.navigation-disabled {
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: 500;
					text-transform: uppercase;
					text-decoration: line-through;
					color: #aaa;
					background: none;
					border: none;
					display: inline-block;
				}
			}
			@media screen and (max-width: 600px) {
				display: none;
			}
		}

		@media screen and (max-width: 600px) {
			grid-column: auto;
		}
	}
</style>
