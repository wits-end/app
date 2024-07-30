<script>
	import Logo from '$lib/components/logo.svelte';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let data;
	$: ({ session, supabase } = data);
	let pending;
	let saved;

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
			<!-- <a href="/about">About</a> -->
			{#if session}
				<a href="/premium" title="Premium">Premium</a>
				<a href="/account/dashboard" title="Account">Account</a>
				<a href="/" on:click={logout} title="Log Out">Log Out</a>
			{:else}
				<a href="/auth/login" title="Log In">Log In</a>
				<a href="/auth/register" title="Register">Register</a>
			{/if}
		</nav>
	</div>
</header>

<main>
	<slot></slot>
</main>

<footer>
	<div class="wrapper">
		<div class="newsletter">
			<h2>Newsletter</h2>
			<form
				action="/api/newsletter/?/addNewsletterEmail"
				method="POST"
				use:enhance={({ formData }) => {
					pending = true;

					return async ({ result, update }) => {
						await update();
						pending = false;
						saved = true;
					};
				}}
			>
				<div class="input-group">
					<div class="field-group">
						<div class="icon">
							<svg
								aria-hidden="true"
								data-prefix="fas"
								data-icon="search"
								class="svg-inline--fa fa-envelope fa-w-16"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
							>
								<path
									fill="currentColor"
									d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"
								>
								</path></svg
							>
						</div>
						<input type="email" name="email" placeholder="email@example.com" />
					</div>
					<button type="submit">subscribe</button>

					{#if pending}
						<p class="flash">saving...</p>
					{:else if saved}
						<p class="flash">email saved</p>
					{/if}
				</div>
			</form>
		</div>
		<!-- <div class="column">
			<h2>Site</h2>
			<a href="/about">About</a>
			<a href="/models">Models</a>
			<a href="/notebooks">Notebooks</a>
			<a href="/research">Research</a>
		</div> -->
		<div class="links">
			<!-- <h2>Links</h2> -->
			<div class="link-list">
				<a href="/about">About</a>
				<a href="https://github.com/wits-end">Code</a>
				<a href="/premium">Premium</a>
				<a href="/privacy">Privacy</a>
				<a href="/terms">Terms</a>
			</div>
		</div>
		<!-- <div class="column">
			<h2>Self</h2>
			<a href="https://github.com/tjwhitaker">Github</a>
			<a href="https://scholar.google.com/citations?user=Rb-16TYAAAAJ&hl=en">Scholar</a>
			<a href="https://orcid.org/0000-0003-3792-3901">Orcid</a>
		</div> -->
	</div>
</footer>

<style lang="scss">
	header {
		width: 100%;
		margin: 0;
		padding: 1rem;
		position: relative;
		background-image: url('$lib/assets/graph-bg.png');
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
					background: rgba(255, 255, 255, 0.5);
					color: black;
					text-decoration: none;
					font-family: 'Open Sans';
					margin-left: 3.2rem;
					text-transform: uppercase;
					font-size: 1.2rem;

					&:hover {
						color: #d33682;
					}

					@media screen and (max-width: 600px) {
						margin-left: 1.5rem;
						font-size: 0.9rem;
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
		background: #eee;
		// background-image: url('$lib/assets/chalk-5-invert.png');
		// background-position: center;
		// background-size: 50rem;
		// background-color: rgba(255, 255, 255, 0.8);
		// background-blend-mode: lighten;
		border-top: 1px solid #ddd;

		.wrapper {
			display: grid;
			grid-template-columns: auto auto;
			justify-content: space-between;
			align-items: center;
			.newsletter {
				h2 {
					color: black;
					font-family: 'Open Sans';
					text-transform: uppercase;
					margin-bottom: 1rem;
					font-size: 1.2rem;
				}

				.input-group {
					display: flex;
					flex-align: center;

					.field-group {
						position: relative;
						width: 100%;

						.icon {
							position: absolute;
							font-size: 0;
							left: 1rem;
							top: 50%;
							transform: translateY(-50%);
							width: 1.5rem;
							color: #0004;
						}
						input {
							width: 100%;
							background: white;
							padding: 1rem 1.5rem;
							color: #0008;
							border: 1px solid #ddd;
							padding-left: 3.5rem;
							font-family: 'Open Sans';
						}
					}
					button {
						font-family: 'Open Sans';
						font-size: 1.2rem;
						font-weight: 500;
						text-transform: uppercase;
						text-decoration: none;
						margin-left: 1rem;
						background: white;
						border: 1px solid #ddd;
						color: #999;
						padding: 0.5rem 1rem;
						transition: all 0.2s ease;

						&:hover {
							border: 1px solid #666;
							color: #000;
						}
					}

					.flash {
						flex: 0 0 auto;
						margin: 0;
						margin-left: 1rem;
						align-self: center;
						font-size: 1.4rem;
					}
				}
			}
			.links {
				h2 {
					color: black;
					font-family: 'Open Sans';
					text-transform: uppercase;
					margin-bottom: 1rem;
					font-size: 1.2rem;
				}
				.link-list {
					a {
						display: inline-block;
						width: max-content;
						color: black;
						font-family: 'Open Sans';
						font-size: 1.2rem;
						margin-right: 2rem;
					}
				}
			}
		}
	}
</style>
