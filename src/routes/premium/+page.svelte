<script></script>

<svelte:head>
	<title>About | Wits End</title>
	<meta name="description" content="An AI platform to empower researchers." />
</svelte:head>

<div class="hero">
	<div class="overlay"></div>

	<div class="wrapper">
		<div class="intro">
			<h1>Premium Memberships <br /> To Empower Researchers</h1>
			<p>Help support Wits End and get access to an ad-free experience with exclusive features.</p>
			<ul>
				<li>No Ads</li>
				<li>Custom Reading Lists</li>
				<li>Theme Settings</li>
				<li>Early access to new features</li>
			</ul>
			<button>$6/month</button>
			<button>$50/Year (Save 30%)</button>
		</div>
	</div>
</div>

<style lang="scss">
	.hero {
		background: url('$lib/assets/anatomical-skull.jpg');
		background-position: right 7% center;
		background-repeat: no-repeat;
		background-size: auto 100%;
		height: 80vh;
		width: 100%;
		position: relative;
		margin-top: -1rem;
		margin-bottom: -1rem;

		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 0;
			background: white;
			opacity: 0.75;
		}

		.wrapper {
			position: relative;
			z-index: 1;
			top: 50%;
			transform: translateY(-50%);

			.intro {
				margin-left: 2%;

				h1 {
					font-family: 'Open Sans';
					font-size: 6.4rem;
					text-transform: uppercase;
					line-height: 1;
					margin-bottom: 2rem;
					color: black;

					@media screen and (max-width: 600px) {
						font-size: 3.8rem;
					}
				}

				p {
					color: black;
					font-size: 1.8rem;
					max-width: 800px;
					margin-bottom: 2rem;
				}

				button {
					background: white;
					border: 1px solid #ddd;
					padding: 1rem 2rem;
					transition: all 0.2s ease;

					&:hover {
						border: 1px solid #666;
					}
				}
			}
		}
	}
</style>
