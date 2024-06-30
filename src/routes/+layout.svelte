<script>
	import Logo from '$lib/logo.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};
</script>

<header>
	<div class="wrapper">
		<Logo />
		<nav>
			<a href="/about">About</a>
			{#if session}
				<a href="/account/dashboard">Account</a>
				<a href="/" on:click={logout}>Logout</a>
			{:else}
				<a href="/auth">Login / Register</a>
			{/if}
		</nav>
	</div>
</header>

<main>
	<slot></slot>
</main>

<footer>
	<div class="wrapper">
		<div class="column">
			<h2>Site</h2>
			<a href="/about">About</a>
			<a href="/models">Models</a>
			<a href="/notebooks">Notebooks</a>
			<a href="/research">Research</a>
		</div>
		<div class="column">
			<h2>Links</h2>
			<a href="https://arxiv-sanity-lite.com">Arxiv Sanity</a>
			<a href="https://paperswithcode.com">Papers With Code</a>
			<a href="https://midjourney.com">Midjourney</a>
			<a href="https://openai.com">OpenAI</a>
		</div>
		<div class="column">
			<h2>Self</h2>
			<a href="https://github.com/tjwhitaker">Github</a>
			<a href="https://scholar.google.com/citations?user=Rb-16TYAAAAJ&hl=en">Scholar</a>
			<a href="https://orcid.org/0000-0003-3792-3901">Orcid</a>
		</div>
	</div>
</footer>

<style lang="scss">
	header {
		width: 100%;
		margin: 0;
		padding: 1rem;
		position: relative;
		background-image: url('$lib/assets/chalk-2-invert.png');
		background-position: center;
		background-size: 50rem;
		background-color: rgba(255, 255, 255, 0.8);
		background-blend-mode: lighten;
		border-bottom: 1px solid #ddd;

		.wrapper {
			display: grid;
			grid-template-columns: auto auto;
			align-items: center;
			justify-content: space-between;
			position: relative;

			nav {
				font-size: 0;

				a {
					color: black;
					text-decoration: none;
					font-weight: 500;
					font-family: 'Open Sans';
					margin-left: 3.2rem;
					text-transform: uppercase;
					font-size: 1.2rem;

					@media screen and (max-width: 600px) {
						margin-left: 1.5rem;
						font-size: 0.9rem;
					}

					&:hover {
						color: blue;
					}
				}
			}
		}
	}

	main {
		background: white;
		padding: 1rem;
		min-height: 80vh;
	}

	footer {
		padding: 1rem;
		padding-bottom: 1rem;
		background-image: url('$lib/assets/chalk-5-invert.png');
		background-position: center;
		background-size: 50rem;
		background-color: rgba(255, 255, 255, 0.8);
		background-blend-mode: lighten;
		border-top: 1px solid #ddd;

		.wrapper {
			display: grid;
			grid-template-columns: auto auto auto;
			grid-column-gap: 5rem;
			justify-content: space-around;

			.column {
				h2 {
					color: black;
					font-family: 'Open Sans';
					text-transform: uppercase;
					margin-bottom: 1rem;
					font-size: 1.2rem;
				}
				a {
					display: block;
					width: max-content;
					margin-bottom: 1rem;
					color: black;
					font-family: 'Open Sans';
					font-size: 1.2rem;
				}
			}
		}
	}
</style>
