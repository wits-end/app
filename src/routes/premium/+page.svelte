<script>
	const priceIds = ['price_1PdICXCfyJF5ohGUmfEZhNe9', 'price_1PdICJCfyJF5ohGUtbrJHC5R'];
</script>

<svelte:head>
	<title>Premium | Wits End</title>
	<meta name="description" content="An AI platform to empower researchers." />
</svelte:head>

<div class="hero">
	<div class="wrapper">
		<div class="intro">
			<h1>Premium Memberships <br /> To Empower Researchers</h1>
			<p>Help support Wits End and get access to an ad-free experience with exclusive features.</p>
			<ul>
				<li>No Ads</li>
				<li>Personal Notes</li>
				<li>Custom Reading Lists</li>
				<li>Theme Settings</li>
				<li>Early access to new features</li>
			</ul>
			<a href="/api/checkout?id={priceIds[1]}">$5/month</a>
			<a href="/api/checkout?id={priceIds[0]}">$50/Year (Save 30%)</a>
		</div>
	</div>
</div>

<style lang="scss">
	.hero {
		background: url('$lib/assets/brain.svg');
		background-position: center right;
		background-size: 60vw;
		background-repeat: no-repeat;
		height: 80vh;
		width: 100%;
		position: relative;
		margin-top: -1rem;
		margin-bottom: -1rem;

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

				a {
					background: #d33682;
					color: white;
					border: none;
					padding: 1rem 2rem;
					margin-right: 1rem;
					font-family: 'Open Sans';
					font-size: 1.2rem;
					font-weight: bold;
					text-transform: uppercase;
					text-decoration: none;
					transition: all 0.2s ease;

					&:hover {
						background-color: #e99ac0;
					}
				}
			}
		}
	}
</style>
