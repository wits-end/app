<script></script>

<svelte:head>
	<title>About | Wits End</title>
	<meta name="description" content="An AI platform to empower researchers." />
</svelte:head>

<div class="hero">
	<div class="overlay"></div>

	<div class="wrapper">
		<div class="intro">
			<h1>An AI Platform To<br /> Empower Researchers</h1>
			<p>
				Deep learning research has exploded over the last decade with tens of thousands of papers
				being published at top conferences every year. This surge in activity has made it difficult
				for experienced researchers to stay up to date on cutting edge ideas and for new researchers
				to find their bearings. This website aims to serve as a valuable resource for machine
				learning practitioners to better explore the research landscape. We do this by leveraging
				algorithms to not only aggregate and curate the most influential research papers in machine
				learning but also to provide succinct summaries, highlight key contributions, and offer
				personalized paper recommendations.
			</p>
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
		filter: grayscale(1);

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
			}
		}
	}
</style>
