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
				Deep learning has absolutely exploded over the last decade as tens of thousands of papers
				are newly published every year. Exploring state of the art research can often feel like
				drinking from a fire hose. Wits End serves as a valuable resource for machine learning
				practitioners to better explore the research landscape.
			</p>
			<p>
				This project is inspired by my experience trying to navigate research during my time in
				academia. Arxiv Sanity and Papers with Code were invaluable to me throughout my PhD but I
				still found it difficult to explore research in a way that resonated with me. This website
				is the platform that I wish I had. A place to find new ideas without needing to trudge
				through the deluge of new research constantly being published. A place where new and
				experienced researchers alike can build and engage in a healthy and productive community.
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
			opacity: 0.85;
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
